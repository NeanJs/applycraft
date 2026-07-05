import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { canAccessAnalytics } from "@/app/lib/internal-access";

const EVENT = {
  started: "event:tool_started",
  completed: "event:generation_completed",
  afterContent: "event:generate_after_tool_content",
  backToTool: "event:back_to_tool_clicked",
  contentInteraction: "event:tool_content_interaction",
} as const;

type DailyRowRaw = {
  day: Date | string;
  tool_started: bigint | number | string;
  generation_completed: bigint | number | string;
  generate_after_tool_content: bigint | number | string;
  back_to_tool_clicked: bigint | number | string;
  tool_content_interaction: bigint | number | string;
};

type PathRowRaw = {
  path: string | null;
  tool_started: bigint | number | string;
  generation_completed: bigint | number | string;
  generate_after_tool_content: bigint | number | string;
};

type CacheRowRaw = {
  tool_type: string;
  count: bigint | number | string;
};

type PerfRowRaw = {
  route: string | null;
  mode: string | null;
  requests: bigint | number | string;
  cache_hits: bigint | number | string;
  p50_total_ms: number | string;
  p95_total_ms: number | string;
  p50_llm_ms: number | string;
  p95_llm_ms: number | string;
};

type DailyPerfRowRaw = {
  day: Date | string;
  requests: bigint | number | string;
  cache_hits: bigint | number | string;
  p50_total_ms: number | string;
  p95_total_ms: number | string;
};

function toNumber(value: bigint | number | string | null | undefined) {
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number.parseInt(value, 10) || 0;
  return 0;
}

function pct(numerator: number, denominator: number) {
  if (!denominator) return "0.0%";
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams?: Promise<{ days?: string }>;
}) {
  const user = await currentUser();
  if (!user) return null;

  const userEmails = user.emailAddresses.map((email) => email.emailAddress);
  const hasAccess = canAccessAnalytics({
    userId: user.id,
    emails: userEmails,
  });

  if (!hasAccess) {
    redirect("/dashboard");
  }

  const params = (await searchParams) ?? {};
  const parsedDays = Number.parseInt(params.days ?? "30", 10);
  const selectedDays = [7, 14, 30].includes(parsedDays) ? parsedDays : 30;

  const now = new Date();
  const fromWindow = new Date(now);
  fromWindow.setDate(fromWindow.getDate() - selectedDays);

  const [eventsWindow, dailyRaw, pathRaw, cacheRaw, perfRaw, dailyPerfRaw] =
    await Promise.all([
      prisma.anonGeneration.findMany({
        where: {
          toolType: {
            in: [
              EVENT.started,
              EVENT.completed,
              EVENT.afterContent,
              EVENT.backToTool,
              EVENT.contentInteraction,
            ],
          },
          createdAt: { gte: fromWindow },
        },
        select: {
          toolType: true,
          sessionKey: true,
          createdAt: true,
        },
      }),
      prisma.$queryRaw<DailyRowRaw[]>`
      SELECT
        date_trunc('day', "createdAt")::date AS day,
        COUNT(*) FILTER (WHERE "toolType" = ${EVENT.started}) AS tool_started,
        COUNT(*) FILTER (WHERE "toolType" = ${EVENT.completed}) AS generation_completed,
        COUNT(*) FILTER (WHERE "toolType" = ${EVENT.afterContent}) AS generate_after_tool_content,
        COUNT(*) FILTER (WHERE "toolType" = ${EVENT.backToTool}) AS back_to_tool_clicked,
        COUNT(*) FILTER (WHERE "toolType" = ${EVENT.contentInteraction}) AS tool_content_interaction
      FROM "AnonGeneration"
      WHERE "toolType" LIKE 'event:%' AND "createdAt" >= ${fromWindow}
      GROUP BY 1
      ORDER BY 1 DESC
    `,
      prisma.$queryRaw<PathRowRaw[]>`
      SELECT
        COALESCE("input"->>'path', '(unknown)') AS path,
        COUNT(*) FILTER (WHERE "toolType" = ${EVENT.started}) AS tool_started,
        COUNT(*) FILTER (WHERE "toolType" = ${EVENT.completed}) AS generation_completed,
        COUNT(*) FILTER (WHERE "toolType" = ${EVENT.afterContent}) AS generate_after_tool_content
      FROM "AnonGeneration"
      WHERE "toolType" IN (${EVENT.started}, ${EVENT.completed}, ${EVENT.afterContent})
        AND "createdAt" >= ${fromWindow}
      GROUP BY 1
      ORDER BY COUNT(*) FILTER (WHERE "toolType" = ${EVENT.started}) DESC
      LIMIT 12
    `,
      prisma.$queryRaw<CacheRowRaw[]>`
      SELECT
        "toolType" AS tool_type,
        COUNT(*) AS count
      FROM "AnonGeneration"
      WHERE "toolType" LIKE 'cache:tailor:%'
        AND "createdAt" >= ${fromWindow}
      GROUP BY "toolType"
      ORDER BY COUNT(*) DESC
    `,
      prisma.$queryRaw<PerfRowRaw[]>`
      SELECT
        COALESCE("input"->>'route', '(unknown)') AS route,
        COALESCE("input"->>'mode', '(unknown)') AS mode,
        COUNT(*) AS requests,
        COUNT(*) FILTER (WHERE "input"->>'cacheHit' = 'true') AS cache_hits,
        percentile_cont(0.5) WITHIN GROUP (ORDER BY ("input"->>'totalMs')::double precision) AS p50_total_ms,
        percentile_cont(0.95) WITHIN GROUP (ORDER BY ("input"->>'totalMs')::double precision) AS p95_total_ms,
        percentile_cont(0.5) WITHIN GROUP (ORDER BY ("input"->>'llmMs')::double precision) AS p50_llm_ms,
        percentile_cont(0.95) WITHIN GROUP (ORDER BY ("input"->>'llmMs')::double precision) AS p95_llm_ms
      FROM "AnonGeneration"
      WHERE "toolType" = 'event:ai_request'
        AND "createdAt" >= ${fromWindow}
        AND "input"->>'totalMs' IS NOT NULL
      GROUP BY 1, 2
      ORDER BY COUNT(*) DESC
    `,
      prisma.$queryRaw<DailyPerfRowRaw[]>`
      SELECT
        date_trunc('day', "createdAt")::date AS day,
        COUNT(*) AS requests,
        COUNT(*) FILTER (WHERE "input"->>'cacheHit' = 'true') AS cache_hits,
        percentile_cont(0.5) WITHIN GROUP (ORDER BY ("input"->>'totalMs')::double precision) AS p50_total_ms,
        percentile_cont(0.95) WITHIN GROUP (ORDER BY ("input"->>'totalMs')::double precision) AS p95_total_ms
      FROM "AnonGeneration"
      WHERE "toolType" = 'event:ai_request'
        AND "createdAt" >= ${fromWindow}
        AND "input"->>'totalMs' IS NOT NULL
      GROUP BY 1
      ORDER BY 1 DESC
    `,
    ]);

  const started = eventsWindow.filter((event) => event.toolType === EVENT.started);
  const completed = eventsWindow.filter(
    (event) => event.toolType === EVENT.completed,
  );
  const afterContent = eventsWindow.filter(
    (event) => event.toolType === EVENT.afterContent,
  );
  const backToTool = eventsWindow.filter(
    (event) => event.toolType === EVENT.backToTool,
  );
  const contentInteractions = eventsWindow.filter(
    (event) => event.toolType === EVENT.contentInteraction,
  );

  const startedSessions = new Set(started.map((event) => event.sessionKey)).size;
  const completedSessions = new Set(completed.map((event) => event.sessionKey)).size;

  const completionRate = pct(completed.length, started.length);
  const sessionCompletionRate = pct(completedSessions, startedSessions);
  const contentAssistRate = pct(afterContent.length, started.length);

  const dailyRows = dailyRaw.map((row) => ({
    day:
      typeof row.day === "string"
        ? row.day
        : row.day.toISOString().split("T")[0],
    started: toNumber(row.tool_started),
    completed: toNumber(row.generation_completed),
    afterContent: toNumber(row.generate_after_tool_content),
    backToTool: toNumber(row.back_to_tool_clicked),
    interactions: toNumber(row.tool_content_interaction),
  }));

  const pathRows = pathRaw.map((row) => {
    const starts = toNumber(row.tool_started);
    const completions = toNumber(row.generation_completed);
    return {
      path: row.path ?? "(unknown)",
      starts,
      completions,
      afterContent: toNumber(row.generate_after_tool_content),
      completionRate: pct(completions, starts),
    };
  });

  const cacheRows = cacheRaw.map((row) => ({
    toolType: row.tool_type,
    count: toNumber(row.count),
  }));

  const totalCacheWrites = cacheRows.reduce((sum, row) => sum + row.count, 0);

  const perfRows = perfRaw.map((row) => {
    const requests = toNumber(row.requests);
    const cacheHits = toNumber(row.cache_hits);
    return {
      route: row.route ?? "(unknown)",
      mode: row.mode ?? "(unknown)",
      requests,
      cacheHits,
      cacheHitRate: pct(cacheHits, requests),
      p50TotalMs: Number(row.p50_total_ms || 0).toFixed(1),
      p95TotalMs: Number(row.p95_total_ms || 0).toFixed(1),
      p50LlmMs: Number(row.p50_llm_ms || 0).toFixed(1),
      p95LlmMs: Number(row.p95_llm_ms || 0).toFixed(1),
    };
  });

  const totalPerfRequests = perfRows.reduce((sum, row) => sum + row.requests, 0);
  const totalPerfCacheHits = perfRows.reduce(
    (sum, row) => sum + row.cacheHits,
    0,
  );

  const dailyPerfRows = dailyPerfRaw.map((row) => {
    const requests = toNumber(row.requests);
    const cacheHits = toNumber(row.cache_hits);
    return {
      day:
        typeof row.day === "string"
          ? row.day
          : row.day.toISOString().split("T")[0],
      requests,
      cacheHits,
      cacheHitRate: pct(cacheHits, requests),
      p50TotalMs: Number(row.p50_total_ms || 0).toFixed(1),
      p95TotalMs: Number(row.p95_total_ms || 0).toFixed(1),
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
            Product analytics
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Funnel performance (first-party)
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-500">
            Internal events captured inside your own database over the last {selectedDays} days,
            no external analytics vendor required.
          </p>
        </div>
        <Link href="/dashboard" className="text-sm text-gray-600">
          ← Back to dashboard
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
          Window
        </span>
        {[7, 14, 30].map((days) => (
          <Link
            key={days}
            href={`/analytics?days=${days}`}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedDays === days
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
            }`}
          >
            {days}d
          </Link>
        ))}
      </div>

      <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400">Starts</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{started.length}</p>
          <p className="mt-1 text-xs text-gray-500">{startedSessions} unique sessions</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400">Completed</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{completed.length}</p>
          <p className="mt-1 text-xs text-gray-500">{completedSessions} unique sessions</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400">Completion rate</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{completionRate}</p>
          <p className="mt-1 text-xs text-gray-500">Session rate: {sessionCompletionRate}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400">Content interactions</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{contentInteractions.length}</p>
          <p className="mt-1 text-xs text-gray-500">FAQ + section opens + return CTA</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400">Back to tool clicks</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{backToTool.length}</p>
          <p className="mt-1 text-xs text-gray-500">From educational content to workspace</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400">Generate after content</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{afterContent.length}</p>
          <p className="mt-1 text-xs text-gray-500">Assist rate: {contentAssistRate}</p>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">Daily rollup ({selectedDays}d)</h2>
        <p className="mt-1 text-sm text-gray-500">
          Use this to spot trend direction instead of one-day noise.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                <th className="py-2 pr-4">Day</th>
                <th className="py-2 pr-4">Starts</th>
                <th className="py-2 pr-4">Completed</th>
                <th className="py-2 pr-4">Completion</th>
                <th className="py-2 pr-4">After content</th>
                <th className="py-2 pr-4">Back to tool</th>
                <th className="py-2 pr-0">Interactions</th>
              </tr>
            </thead>
            <tbody>
              {dailyRows.map((row) => (
                <tr key={row.day} className="border-b border-gray-50 text-gray-700 last:border-0">
                  <td className="py-2 pr-4 font-medium text-gray-900">{row.day}</td>
                  <td className="py-2 pr-4">{row.started}</td>
                  <td className="py-2 pr-4">{row.completed}</td>
                  <td className="py-2 pr-4">{pct(row.completed, row.started)}</td>
                  <td className="py-2 pr-4">{row.afterContent}</td>
                  <td className="py-2 pr-4">{row.backToTool}</td>
                  <td className="py-2 pr-0">{row.interactions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">Path performance ({selectedDays}d)</h2>
        <p className="mt-1 text-sm text-gray-500">
          Which tool pages generate starts and completions most effectively.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                <th className="py-2 pr-4">Path</th>
                <th className="py-2 pr-4">Starts</th>
                <th className="py-2 pr-4">Completed</th>
                <th className="py-2 pr-4">Completion</th>
                <th className="py-2 pr-0">After content</th>
              </tr>
            </thead>
            <tbody>
              {pathRows.map((row) => (
                <tr key={row.path} className="border-b border-gray-50 text-gray-700 last:border-0">
                  <td className="py-2 pr-4 font-medium text-gray-900">{row.path}</td>
                  <td className="py-2 pr-4">{row.starts}</td>
                  <td className="py-2 pr-4">{row.completions}</td>
                  <td className="py-2 pr-4">{row.completionRate}</td>
                  <td className="py-2 pr-0">{row.afterContent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">AI cache utilization ({selectedDays}d)</h2>
        <p className="mt-1 text-sm text-gray-500">
          Cache entries written per mode signature. Higher values typically indicate
          repeated demand where cached responses reduce cost and latency.
        </p>

        <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-600">
          Total cache entries: <span className="font-semibold text-gray-900">{totalCacheWrites}</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                <th className="py-2 pr-4">Cache key</th>
                <th className="py-2 pr-0">Writes</th>
              </tr>
            </thead>
            <tbody>
              {cacheRows.map((row) => (
                <tr key={row.toolType} className="border-b border-gray-50 text-gray-700 last:border-0">
                  <td className="py-2 pr-4 font-medium text-gray-900">{row.toolType}</td>
                  <td className="py-2 pr-0">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">AI performance by mode ({selectedDays}d)</h2>
        <p className="mt-1 text-sm text-gray-500">
          Rolling latency and cache-hit metrics from internal AI request events.
        </p>

        <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-600">
          Total tracked AI requests: <span className="font-semibold text-gray-900">{totalPerfRequests}</span>
          <span className="mx-2 text-gray-300">|</span>
          Overall cache hit rate: <span className="font-semibold text-gray-900">{pct(totalPerfCacheHits, totalPerfRequests)}</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                <th className="py-2 pr-4">Route</th>
                <th className="py-2 pr-4">Mode</th>
                <th className="py-2 pr-4">Requests</th>
                <th className="py-2 pr-4">Cache hit rate</th>
                <th className="py-2 pr-4">P50 total ms</th>
                <th className="py-2 pr-4">P95 total ms</th>
                <th className="py-2 pr-4">P50 llm ms</th>
                <th className="py-2 pr-0">P95 llm ms</th>
              </tr>
            </thead>
            <tbody>
              {perfRows.map((row) => (
                <tr key={`${row.route}:${row.mode}`} className="border-b border-gray-50 text-gray-700 last:border-0">
                  <td className="py-2 pr-4 font-medium text-gray-900">{row.route}</td>
                  <td className="py-2 pr-4">{row.mode}</td>
                  <td className="py-2 pr-4">{row.requests}</td>
                  <td className="py-2 pr-4">{row.cacheHitRate}</td>
                  <td className="py-2 pr-4">{row.p50TotalMs}</td>
                  <td className="py-2 pr-4">{row.p95TotalMs}</td>
                  <td className="py-2 pr-4">{row.p50LlmMs}</td>
                  <td className="py-2 pr-0">{row.p95LlmMs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">Daily cache-hit trend ({selectedDays}d)</h2>
        <p className="mt-1 text-sm text-gray-500">
          Day-level cache hit rate and tail latency trend from AI request events.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                <th className="py-2 pr-4">Day</th>
                <th className="py-2 pr-4">Requests</th>
                <th className="py-2 pr-4">Cache hits</th>
                <th className="py-2 pr-4">Cache hit rate</th>
                <th className="py-2 pr-4">P50 total ms</th>
                <th className="py-2 pr-0">P95 total ms</th>
              </tr>
            </thead>
            <tbody>
              {dailyPerfRows.map((row) => (
                <tr key={row.day} className="border-b border-gray-50 text-gray-700 last:border-0">
                  <td className="py-2 pr-4 font-medium text-gray-900">{row.day}</td>
                  <td className="py-2 pr-4">{row.requests}</td>
                  <td className="py-2 pr-4">{row.cacheHits}</td>
                  <td className="py-2 pr-4">{row.cacheHitRate}</td>
                  <td className="py-2 pr-4">{row.p50TotalMs}</td>
                  <td className="py-2 pr-0">{row.p95TotalMs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
