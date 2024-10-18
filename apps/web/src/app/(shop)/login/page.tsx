import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import ResponsiveImage from "~/components/ResponsiveImage";
import LoginForm from "./LoginForm";

export default function LogIn() {
  return (
    <div className="grid-container mb-32 lg:mb-40 lg:mt-16">
      <AnalyticsPageTracker page="account-exists" />

      <h3 className="col-span-full mb-2 font-semibold max-lg:mt-3 lg:col-start-3 lg:mb-4">
        What’s your email?{" "}
      </h3>
      <div className="col-span-full grid grid-cols-subgrid bg-white max-lg:mb-18 lg:col-span-8 lg:col-start-3">
        <div className="hidden lg:col-span-3 lg:block">
          <ResponsiveImage
            className="h-full"
            url="/images/login/placeholder_desktop.png"
            desktopUrl="/images/login/placeholder_desktop.png"
            alt="login_placeholder"
            width={293}
            height={496}
            desktopWidth={293}
            desktopHeight={496}
          />
        </div>
        <div className="col-span-full px-4 py-6 lg:col-span-5 lg:pl-0 lg:pr-6 lg:pt-14">
          <p>
            We’ll check if you have a Lingo account, and help you create one if
            you don’t.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
