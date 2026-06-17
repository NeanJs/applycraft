import { prisma } from "../lib/prisma";

export function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    return ips[ips.length - 1];
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function checkAnonRateLimit(ip: string): Promise<boolean> {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const existing = await tx.anonUsage.findUnique({ where: { ip } });

    // Window expired — reset and allow
    if (existing && existing.resetAt < now) {
      await tx.anonUsage.update({
        where: { ip },
        data: {
          count: 1,
          resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
      return true;
    }

    // Create or increment atomically
    const entry = await tx.anonUsage.upsert({
      where: { ip },
      update: { count: { increment: 1 } },
      create: {
        ip,
        count: 1,
        resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return entry.count <= 1;
  });
}
