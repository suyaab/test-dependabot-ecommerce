import { IconProps } from "./type";

export default function CirclePlank({
  color = "#009CDE",
  className,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="57"
      height="48"
      viewBox="0 0 57 48"
      fill="none"
      className={className}
    >
      <path
        d="M4.53451 24C4.53451 10.8832 15.1678 0.249997 28.2845 0.249998C41.4013 0.249999 52.0345 10.8832 52.0345 24C52.0345 37.1168 41.4013 47.75 28.2845 47.75C15.1677 47.75 4.53451 37.1168 4.53451 24Z"
        stroke={color}
        strokeWidth="0.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path d="M0.00437546 34.7148H56.5758" stroke={color} strokeWidth="2" />
    </svg>
  );
}
