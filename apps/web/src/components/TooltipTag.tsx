import InfoIcon from "~/icons/InfoIcon";
import cn from "~/lib/utils";
import HoverPopover from "./HoverPopover";

export default function TooltipTag({
  title = "",
  content = "",
  showIcon = false,
  className,
}: {
  title: string;
  content: string;
  showIcon?: boolean;
  className?: string;
}) {
  const trigger = (
    <div
      className={cn(
        "flex items-center gap-x-2 rounded border border-charcoal/70 bg-white px-2 py-1 text-xs",
        className,
      )}
    >
      <div
        className="cursor-default text-charcoal/80"
        dangerouslySetInnerHTML={{
          __html: title,
        }}
      />
      {showIcon && <InfoIcon className="size-3" />}
    </div>
  );

  const htmlContent = <div dangerouslySetInnerHTML={{ __html: content }} />;

  return <HoverPopover trigger={trigger} content={htmlContent} />;
}
