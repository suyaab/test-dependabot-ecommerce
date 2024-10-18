import { IconProps } from "./type";

export default function CircleArcs({
  color = "#009CDE",
  className,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="43"
      height="43"
      viewBox="0 0 43 43"
      fill="none"
      className={className}
    >
      <path
        d="M42.5 21.5C42.5 33.098 33.098 42.5 21.5 42.5C9.90202 42.5 0.5 33.098 0.5 21.5C0.5 9.90202 9.90202 0.5 21.5 0.5C33.098 0.5 42.5 9.90202 42.5 21.5Z"
        stroke={color}
      />
      <mask
        id="mask0_8809_2632"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="43"
        height="43"
      >
        <path
          d="M21.5 43C33.3741 43 43 33.3741 43 21.5C43 9.62588 33.3741 0 21.5 0C9.62588 0 0 9.62588 0 21.5C0 33.3741 9.62588 43 21.5 43Z"
          fill="#D9D9D9"
        />
      </mask>
      <g mask="url(#mask0_8809_2632)">
        <path
          d="M42 30.712C42 42.0339 32.8218 51.212 21.5 51.212C10.1782 51.212 1 42.0339 1 30.712C1 19.3902 10.1782 10.212 21.5 10.212C32.8218 10.212 42 19.3902 42 30.712Z"
          stroke={color}
          strokeWidth="2"
        />
        <path
          d="M41.5 41.46C41.5 52.5057 32.5457 61.46 21.5 61.46C10.4543 61.46 1.5 52.5057 1.5 41.46C1.5 30.4143 10.4543 21.46 21.5 21.46C32.5457 21.46 41.5 30.4143 41.5 41.46Z"
          stroke={color}
          strokeWidth="3"
        />
        <path
          d="M41 52.2078C41 62.9773 32.2696 71.7078 21.5 71.7078C10.7304 71.7078 2 62.9773 2 52.2078C2 41.4382 10.7304 32.7078 21.5 32.7078C32.2696 32.7078 41 41.4382 41 52.2078Z"
          stroke={color}
          strokeWidth="4"
        />
      </g>
    </svg>
  );
}
