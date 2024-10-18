import { IconProps } from "~/icons/type";
import cn from "~/lib/utils";

export default function InfoIcon({ className, color = "#222731" }: IconProps) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={cn("inline fill-none", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 3.125C6.10355 3.125 6.1875 3.20895 6.1875 3.3125C6.1875 3.41605 6.10355 3.5 6 3.5"
        strokeWidth="0.5"
        stroke={color}
      />
      <path
        d="M6 3.125C5.89645 3.125 5.8125 3.20895 5.8125 3.3125C5.8125 3.41605 5.89645 3.5 6 3.5"
        stroke={color}
        strokeWidth="0.5"
      />
      <path
        d="M6 5L6 9.125"
        stroke={color}
        strokeWidth="0.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M6 11.625C9.1066 11.625 11.625 9.1066 11.625 6C11.625 2.8934 9.1066 0.375 6 0.375C2.8934 0.375 0.375 2.8934 0.375 6C0.375 9.1066 2.8934 11.625 6 11.625Z"
        stroke={color}
        strokeWidth="0.5"
        strokeMiterlimit="10"
      />
    </svg>
  );
}
