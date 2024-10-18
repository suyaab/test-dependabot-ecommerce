import { IconProps } from "./type";

export default function CircleGraph({
  color = "#009CDE",
  className,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="29"
      height="24"
      viewBox="0 0 29 24"
      fill="none"
      className={className}
    >
      <path
        d="M25.5 12C25.5 18.3513 20.3513 23.5 14 23.5C7.64873 23.5 2.5 18.3513 2.5 12C2.5 5.64873 7.64873 0.5 14 0.5C20.3513 0.5 25.5 5.64873 25.5 12Z"
        stroke={color}
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M1 13.8393C4.41046 13.8393 4.70854 9 6.61316 9C7.98848 9 9.17653 15 12.2676 15C15.3587 15 15.881 12.3168 19.9212 12.3168C23.9614 12.3168 24.4137 13.448 28 13.448"
        stroke={color}
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
