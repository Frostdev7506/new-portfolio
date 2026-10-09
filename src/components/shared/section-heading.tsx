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
      <p className="inline-flex rounded-full border border-border bg-white/75 px-3 py-1 text-xs uppercase tracking-[0.22em] text-brand-700 dark:bg-slate-900/75 dark:text-brand-300">
        {label}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-slate-900 dark:text-slate-100 md:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-pretty text-base text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </header>
  );
}
