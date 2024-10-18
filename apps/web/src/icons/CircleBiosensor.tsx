import { IconProps } from "./type";

export default function CircleBiosensor({
  color = "#009CDE",
  className,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_4942_9999)">
        <path
          d="M47.5095 24.0048C47.5095 36.9861 36.9861 47.5095 24.0048 47.5095C11.0234 47.5095 0.5 36.9861 0.5 24.0048C0.5 11.0234 11.0234 0.5 24.0048 0.5C36.9861 0.5 47.5095 11.0234 47.5095 24.0048Z"
          stroke={color}
        />
        <path
          d="M36.5 24C36.5 30.9036 30.9036 36.5 24 36.5C17.0964 36.5 11.5 30.9036 11.5 24C11.5 17.0964 17.0964 11.5 24 11.5C30.9036 11.5 36.5 17.0964 36.5 24Z"
          stroke={color}
        />
        <path
          d="M26.75 24C26.75 25.5188 25.5188 26.75 24 26.75C22.4812 26.75 21.25 25.5188 21.25 24C21.25 22.4812 22.4812 21.25 24 21.25C25.5188 21.25 26.75 22.4812 26.75 24Z"
          stroke={color}
          strokeWidth="0.5"
        />
      </g>
      <defs>
        <clipPath id="clip0_4942_9999">
          <rect width="48" height="48" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
