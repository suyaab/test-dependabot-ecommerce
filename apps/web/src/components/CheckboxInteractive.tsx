import Checkmark from "~/icons/Checkmark";
import cn from "~/lib/utils";

interface CheckboxInteractiveProps {
  containerClassName?: string;
  isChecked: boolean;
  isInvalid: boolean;
  baseColor?: string;
  checkedColor?: string;
  invalidColor?: string;
  hoverColor?: string;
}

export default function CheckboxInteractive({
  containerClassName,
  isChecked,
  isInvalid,
  baseColor = "charcoal/40",
  checkedColor = "charcoal",
  invalidColor = "red",
  hoverColor = "charcoal",
}: CheckboxInteractiveProps) {
  return (
    <div
      className={cn(
        "z-10 h-6 w-6 rounded border-2 bg-inherit",
        containerClassName,
        `border-${baseColor}`,
        `hover:border-${hoverColor}`,
        isChecked && `bg-${checkedColor}`,
        isInvalid && `border-${invalidColor}`,
      )}
    >
      {isChecked && <Checkmark className="h-5 w-5" color="white" />}
    </div>
  );
}
