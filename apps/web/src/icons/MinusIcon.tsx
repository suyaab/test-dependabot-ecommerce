import { IconProps } from "./type";

export default function MinusIcon({ color = "#222731", className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="2"
      viewBox="0 0 14 2"
      fill="none"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 2L8.74228e-08 2L0 6.11959e-07L14 0V2Z"
        fill={color}
      />
    </svg>
  );
}
