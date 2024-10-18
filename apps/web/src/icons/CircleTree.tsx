import { IconProps } from "./type";

export default function CircleRockStack({
  color = "#009CDE",
  className,
}: IconProps) {
  return (
    <svg
      width="43"
      height="43"
      viewBox="0 0 43 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M42.5 21.5C42.5 33.098 33.098 42.5 21.5 42.5C9.90202 42.5 0.5 33.098 0.5 21.5C0.5 9.90202 9.90202 0.5 21.5 0.5C33.098 0.5 42.5 9.90202 42.5 21.5Z"
        stroke={color}
      />
      <mask
        id="mask0_6949_829"
        // style={"mask-type:alpha"}
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
      <g mask="url(#mask0_6949_829)">
        <path
          d="M-6.59521 22.09H-0.17442C11.7937 22.09 21.4958 31.7921 21.4958 43.7602V43.7602"
          stroke={color}
          strokeWidth="3"
        />
        <path
          d="M-6.59521 4.46716V4.46716C8.91903 4.46716 21.4958 17.0439 21.4958 32.5582V42.1894"
          stroke={color}
          strokeWidth="2"
        />
        <path
          d="M49.5852 22.09H43.1644C31.1963 22.09 21.4942 31.7921 21.4942 43.7602V43.7602"
          stroke={color}
          strokeWidth="3"
        />
        <path
          d="M49.5852 4.46716V4.46716C34.071 4.46716 21.4942 17.0439 21.4942 32.5582V42.1894"
          stroke={color}
          strokeWidth="2"
        />
        <path d="M21.4951 42.957V-9.21204" stroke={color} />
      </g>
    </svg>
  );
}
