import { IconProps } from "./type";

export default function CircleDouble({
  color = "#009CDE",
  className,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="62"
      height="48"
      viewBox="0 0 62 48"
      fill="none"
      className={className}
    >
      <path
        d="M0.500551 24C0.500553 11.0213 11.0219 0.499997 24.0006 0.499998C36.9792 0.499999 47.5006 11.0213 47.5006 24C47.5006 36.9787 36.9792 47.5 24.0005 47.5C11.0219 47.5 0.50055 36.9787 0.500551 24Z"
        stroke={color}
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M13.9648 24C13.9648 10.8832 24.5981 0.249997 37.7148 0.249998C50.8316 0.249999 61.4648 10.8832 61.4648 24C61.4648 37.1168 50.8316 47.75 37.7148 47.75C24.5981 47.75 13.9648 37.1168 13.9648 24Z"
        stroke={color}
        strokeWidth="0.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
