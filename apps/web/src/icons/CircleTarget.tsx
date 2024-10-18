import { IconProps } from "./type";

export default function CircleTarget({
  color = "#009CDE",
  className,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <circle cx="12" cy="12" r="11.5" stroke={color} />
      <circle cx="12" cy="12" r="6.5" stroke={color} />
      <circle cx="12" cy="12" r="2" fill={color} />
    </svg>
  );
}
