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
            <span className="section-kicker">{eyebrow}</span>
            <h2 className="section-title">{title}</h2>
            <p className={`section-subtitle ${centered ? 'mx-auto' : ''}`}>{description}</p>
        </div>
    );
}
