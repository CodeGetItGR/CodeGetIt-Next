import { usePublicOffer } from './usePublicOffer';

export const ProjectCard = () => {
    const { offer, text } = usePublicOffer();

    return (
        <div className="mt-6 rounded-[10px] border border-slate-900/[0.08] bg-white p-5">
            <p className="text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase">{text.project}</p>
            <h3 className="mt-1 text-base font-bold text-slate-900">{offer.project.name}</h3>
            {offer.project.description && <p className="mt-1.5 text-sm text-slate-500">{offer.project.description}</p>}
        </div>
    );
};
