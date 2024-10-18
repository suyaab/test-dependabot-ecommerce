import ArrowRight from "~/icons/ArrowRight";
import FeatureFlags from "./FeatureFlags";
import isDashboardEnabled from "./isDashboardEnabled";

export default async function InternalDashboard() {
  await isDashboardEnabled();

  return (
    <div className="container">
      <h1 className="my-4">E-commerce Internal Dashboard</h1>

      <a href="/dashboard/ui">
        <div className="my-8 flex-grow rounded-2xl border-2 border-b-charcoal/10 bg-white px-10 py-8">
          <div className="flex items-center justify-between">
            <h5 className="text-xl font-bold">🎨 UI Components</h5>
            <ArrowRight />
          </div>
        </div>
      </a>

      <div className="my-8 flex-grow rounded-2xl border-2 border-b-charcoal/10 bg-white px-10 py-8">
        <h5 className="mb-4 text-xl font-bold">🏁 Feature Flags</h5>

        <FeatureFlags />
      </div>
    </div>
  );
}
