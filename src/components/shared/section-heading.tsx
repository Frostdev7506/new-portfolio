type SectionHeadingProps = {
  label: string;
  title: string;
  description: string;
  center?: boolean;
};

export function SectionHeading({
  label,
  title,
  description,
  center = true,
}: SectionHeadingProps) {
  return (
    <header className={center ? "rise-on-load text-center" : "rise-on-load text-left"}>
      <p className="inline-flex rounded-full border border-border bg-slate-900/75 px-3 py-1 text-xs uppercase tracking-[0.22em] text-brand-300">
        {label}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-slate-100 md:text-4xl">
        {title}
      </h2>
      <p
        className={`${center ? "mx-auto" : ""} mt-3 max-w-2xl text-pretty text-base leading-relaxed text-slate-300`}
      >
        {description}
      </p>
      <span
        aria-hidden
        className={`${center ? "mx-auto" : ""} mt-4 block h-px w-24 bg-gradient-to-r from-cyan-300/0 via-cyan-300/70 to-cyan-300/0`}
      />
    </header>
  );
}
