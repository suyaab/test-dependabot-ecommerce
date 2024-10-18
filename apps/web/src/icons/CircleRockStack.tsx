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
      <path
        d="M29.2142 34.9375C29.2142 38.38 25.9548 41.5 21.4999 41.5C17.045 41.5 13.7856 38.38 13.7856 34.9375C13.7856 31.495 17.045 28.375 21.4999 28.375C25.9548 28.375 29.2142 31.495 29.2142 34.9375Z"
        fill={color}
        stroke={color}
        strokeWidth="3"
      />
      <path
        d="M30.2142 21.5C30.2142 22.7326 29.3541 23.941 27.7635 24.8688C26.1852 25.7895 23.9718 26.375 21.4999 26.375C19.0281 26.375 16.8147 25.7895 15.2364 24.8688C13.6458 23.941 12.7856 22.7326 12.7856 21.5C12.7856 20.2674 13.6458 19.059 15.2364 18.1312C16.8147 17.2105 19.0281 16.625 21.4999 16.625C23.9718 16.625 26.1852 17.2105 27.7635 18.1312C29.3541 19.059 30.2142 20.2674 30.2142 21.5Z"
        fill={color}
        stroke={color}
      />
      <path
        d="M30.2142 12.6696C30.2142 12.9523 30.0632 13.2816 29.6584 13.6404C29.2542 13.9988 28.6408 14.3444 27.8399 14.6447C26.2417 15.244 24.0003 15.6249 21.4999 15.6249C18.9996 15.6249 16.7582 15.244 15.16 14.6447C14.3591 14.3444 13.7457 13.9988 13.3415 13.6404C12.9367 13.2816 12.7856 12.9523 12.7856 12.6696C12.7856 12.3868 12.9367 12.0576 13.3415 11.6987C13.7457 11.3404 14.3591 10.9948 15.16 10.6944C16.7582 10.0951 18.9996 9.71423 21.4999 9.71423C24.0003 9.71423 26.2417 10.0951 27.8399 10.6944C28.6408 10.9948 29.2542 11.3404 29.6584 11.6987C30.0632 12.0576 30.2142 12.3868 30.2142 12.6696Z"
        fill={color}
        stroke={color}
      />
    </svg>
  );
}
