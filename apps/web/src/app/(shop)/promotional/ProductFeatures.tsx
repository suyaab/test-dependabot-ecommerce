import Checkmark from "~/icons/Checkmark";

export interface SharedFeaturesProps {
  title: string;
  features: string[];
}

export default function SharedFeatures(props: SharedFeaturesProps) {
  const { title, features } = props;
  return (
    <div className="col-span-full mb-5">
      <p className="mb-2 font-semibold">{title}</p>
      <ul className="space-y-2 text-charcoal/70">
        {features.map((feature) => (
          <li className="grid grid-cols-[14px_1fr] gap-3" key={feature}>
            <Checkmark className="mt-1.5 opacity-70" />
            <p dangerouslySetInnerHTML={{ __html: feature }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
