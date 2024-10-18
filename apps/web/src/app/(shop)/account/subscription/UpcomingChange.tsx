import Hyperlink from "~/components/Hyperlink";

export default function UpcomingChange({
  title,
  subtitle,
  buttonText,
}: {
  title: string;
  subtitle: string;
  buttonText: string;
}) {
  return (
    <div className="my-2 rounded-2xl border border-charcoal/10 bg-white px-10 py-8">
      <div className="flex flex-col justify-between lg:flex-row lg:items-center">
        <div className="flex flex-col">
          <h4 className="subtitle mb-2">{title}</h4>

          <p>{subtitle}</p>
        </div>

        <Hyperlink
          url="/account/subscription/update"
          variant="outline"
          text={buttonText}
          className="mt-4 lg:mt-0"
        />
      </div>
    </div>
  );
}
