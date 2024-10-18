import { IconProps } from "./type";

export default function ThumbsUp({ color = "#222731", className }: IconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5 15.5007C4.85146 15.5059 5.20069 15.5575 5.53867 15.654L7.96133 16.346C8.31841 16.4481 8.68796 16.4999 9.05933 16.5H12.316C14.3703 16.5 16.0906 14.944 16.296 12.9L16.496 9.5C16.5689 8.06876 15.6194 6.78579 14.2293 6.43733L13.2593 6.22533C12.8132 6.11472 12.5 5.71427 12.5 5.25467V3C12.5 2.17157 11.8284 1.5 11 1.5C10.1716 1.5 9.5 2.17157 9.5 3V4.036C9.5 6.79742 7.26142 9.036 4.5 9.036L4.5 15.5007Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 7.5H4.5V16.5H1.5V7.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
