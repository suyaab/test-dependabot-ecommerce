import { IconProps } from "./type";

export default function Spinner({ color = "#fff", className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="circle"
        cx="32"
        cy="32"
        r="28"
        stroke={color}
        strokeWidth="5"
      />
    </svg>
  );
}
