import { ResumeData } from "../types/types";

function toHref(url: string): string {
  return url.startsWith("http") ? url : `https://${url}`;
}

function SectionHeading({ title }: { title: string }) {
  return (
    // break-after-avoid: prevents an orphaned heading at the bottom of a printed page.
    <div className="mb-2 mt-5 break-after-avoid first:mt-0">
      <h2 className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-gray-800">
        {title}
      </h2>
      <div className="mt-0.5 h-px bg-gray-400" />
    </div>
  );
}

function ContactItem({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    // ATS reads "Label: value" plain text — no icon-only labels.
    <span className="flex items-center gap-1 text-[12px]">
      <span className="text-gray-600">{label}:</span>
      {href ? (
        <a
          href={href}
          className="text-gray-900 underline-offset-2 hover:underline print:no-underline print:text-gray-900"
          target="_blank"
          rel="noopener noreferrer"
        >
          {value}
        </a>
      ) : (
        <span className="text-gray-900">{value}</span>
      )}
    </span>
  );
}

export default function ResumeTemplate({
  resumeData,
}: {
  resumeData: ResumeData;
}) {
  const d = resumeData;

  return (
    <div className="bg-gray-100 p-8 print:bg-white print:p-0">
      <main className="mx-auto w-full max-w-204 bg-white px-12 py-7 shadow-md print:p-0 print:shadow-none">
        <header className="mb-3">
          <h1 className="text-[24px] font-bold leading-tight tracking-tight text-gray-900">
            {d?.name}
          </h1>
          <p className="mb-1.5 text-[13px] font-semibold text-gray-700">
            {d?.title}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-0.5">
            <ContactItem
              label="Email"
              value={d?.email}
              href={`mailto:${d?.email}`}
            />
            <ContactItem label="Phone" value={d?.phone} />
            <ContactItem label="Location" value={d?.location} />
            {d?.linkedin && (
              <ContactItem
                label="LinkedIn"
                value={d?.linkedin}
                href={toHref(d?.linkedin)}
              />
            )}
            {d?.github && (
              <ContactItem
                label="GitHub"
                value={d?.github}
                href={toHref(d?.github)}
              />
            )}
            {d?.website && (
              <ContactItem
                label="Website"
                value={d?.website}
                href={toHref(d?.website)}
              />
            )}
          </div>
        </header>

        {/* ── SUMMARY ── */}
        <section
          className="break-inside-avoid-page"
          aria-label="Professional Summary"
        >
          <SectionHeading title="Summary" />
          <p className="text-[12.5px] leading-normal text-gray-800">
            {d?.summary}
          </p>
        </section>

        <section className="break-inside-avoid-page" aria-label="Skills">
          <SectionHeading title="Technical Skills" />
          <div className="space-y-0.5">
            {d?.skills &&
              d?.skills.map((group) => (
                <div
                  key={group.category}
                  className="flex gap-1.5 text-[12.5px] leading-snug"
                >
                  <span className="w-28 shrink-0 font-semibold text-gray-900">
                    {group.category}:
                  </span>
                  <span className="text-gray-800">
                    {group.items.join(", ")}
                  </span>
                </div>
              ))}
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section aria-label="Work Experience">
          <SectionHeading title="Experience" />
          {/* space-y-4: tighter than the old space-y-5, recovers ~4px per job entry */}
          <div className="space-y-4">
            {d?.experience?.map((job) => (
              // break-inside-avoid-page: keeps job header + bullets together on one page.
              <div
                key={`${job.company}-${job.title}`}
                className="break-inside-avoid-page"
              >
                {/* Role header: Title · Company on left; Date then Location on right.
                    Date comes before location — it's what recruiters scan for first. */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <div>
                    <span className="text-[13.5px] font-semibold text-gray-900">
                      {job.title}
                    </span>
                    <span className="mx-1.5 text-gray-600">·</span>
                    <span className="text-[13px] font-medium text-gray-800">
                      {job.company}
                    </span>
                  </div>
                  <div className="flex gap-3 text-[12px]">
                    {/* Date first — recruiter priority */}
                    <span className="text-gray-700">
                      {job.startDate} – {job.endDate}
                    </span>
                    <span className="text-gray-500">{job.location}</span>
                  </div>
                </div>

                {/* Bullets — leading-normal reclaims space vs leading-relaxed without hurting readability */}
                <ul className="mt-1 space-y-0.5 pl-4">
                  {job.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="list-disc text-[12.5px] leading-normal text-gray-800 marker:text-gray-600"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── EDUCATION ── */}
        <section className="break-inside-avoid-page" aria-label="Education">
          <SectionHeading title="Education" />
          <div className="space-y-2">
            {d?.education?.map((edu) => (
              <div key={edu.institution} className="break-inside-avoid-page">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="text-[13.5px] font-semibold text-gray-900">
                    {edu.institution}
                  </span>
                  <span className="text-[12px] text-gray-700">
                    {edu.graduationDate}
                  </span>
                </div>
                <p className="text-[12.5px] text-gray-800">
                  {edu.degree} in {edu.field}
                  {edu.honors && ` — ${edu.honors}`}
                  {edu.gpa && ` · GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROJECTS (optional) ── */}
        {d?.projects && d?.projects.length > 0 && (
          <section className="break-inside-avoid-page" aria-label="Projects">
            <SectionHeading title="Projects" />
            <div className="space-y-1.5">
              {d?.projects.map((proj) => (
                <div key={proj.name} className="break-inside-avoid-page">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-[13px] font-semibold text-gray-900">
                      {proj.name}
                    </span>
                    {proj.link && (
                      // Link visible on screen; inherits body color in print (no colored link on B&W)
                      <a
                        href={toHref(proj.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-gray-600 underline-offset-2 hover:underline print:text-gray-800 print:no-underline"
                      >
                        {proj.link}
                      </a>
                    )}
                  </div>
                  <p className="text-[12.5px] leading-normal text-gray-800">
                    {proj.description}{" "}
                    <span className="text-gray-600">
                      ({proj.technologies.join(", ")})
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── CERTIFICATIONS (optional) ── */}
        {d?.certifications && d?.certifications.length > 0 && (
          <section
            className="break-inside-avoid-page"
            aria-label="Certifications"
          >
            <SectionHeading title="Certifications" />
            <ul className="space-y-0.5 pl-4">
              {d?.certifications.map((cert) => (
                <li
                  key={cert}
                  className="list-disc text-[12.5px] leading-normal text-gray-800 marker:text-gray-600"
                >
                  {cert}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
