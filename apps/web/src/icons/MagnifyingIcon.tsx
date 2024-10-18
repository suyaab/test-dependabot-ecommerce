import { IconProps } from "./type";

export default function MagnifyingIcon({
  color = "#222731",
  className,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      className={className}
    >
      <circle
        cx="25.8176"
        cy="26.3181"
        r="7"
        transform="rotate(-45 25.8176 26.3181)"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M32.8887 32.6819L38.192 37.9852"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
}
