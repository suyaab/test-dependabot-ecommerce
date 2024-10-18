import { IconProps } from "./type";

export default function Checkmark({ className, color = "#002A3A" }: IconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3.5 7.71333L4.92917 9.74158C5.03916 9.90587 5.22175 10.0069 5.41938 10.0128C5.61701 10.0187 5.80531 9.92877 5.92492 9.77133L10.5 3.98291"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
