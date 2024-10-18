import Hyperlink from "~/components/Hyperlink";

export default function NoActiveSubscription({
  url = "/account/subscription/update",
}: {
  url?: string;
}) {
  return (
    <div className="my-2 rounded-2xl border border-charcoal/10 bg-white px-10 py-8">
      <div className="flex flex-col justify-between lg:flex-row lg:items-center">
        <div className="flex flex-col">
          <h4 className="subtitle mb-2">No active plan</h4>
          <p>Would you like to order more Lingo biosensors?</p>
        </div>
        <Hyperlink
          url={url}
          variant="dark"
          text="Update plan"
          className="mt-4 lg:mt-0"
        />
      </div>
    </div>
  );
}
