export function SectionHeading({
    eyebrow,
    title,
    description,
    centered = true,
}: {
    eyebrow: string;
    title: string;
    description: string;
    centered?: boolean;
}) {
    return (
        <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
            <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[11px] font-semibold tracking-[0.24em] text-slate-300 uppercase">
                {eyebrow}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-balance text-white md:text-5xl">{title}</h2>
            <p className="mt-4 text-base leading-7 text-pretty text-slate-300 md:text-lg">{description}</p>
        </div>
    );
}
