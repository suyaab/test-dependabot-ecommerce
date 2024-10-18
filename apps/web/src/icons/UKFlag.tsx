import { IconProps } from "./type";

export default function UKFlag({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_8979_5751)">
        <rect width="16" height="16" rx="8" fill="white" />
        <g clipPath="url(#clip1_8979_5751)">
          <mask
            id="mask0_8979_5751"
            maskUnits="userSpaceOnUse"
            x="-8"
            y="0"
            width="32"
            height="16"
          >
            <path d="M-8 0V16H24V0H-8Z" fill="white" />
          </mask>
          <g mask="url(#mask0_8979_5751)">
            <path d="M-8 0V16H24V0H-8Z" fill="#012169" />
            <path d="M-8 0L24 16L-8 0ZM24 0L-8 16L24 0Z" fill="black" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.42299 8.00042L-8.71484 1.4315L-7.28376 -1.43066L8.0007 6.21157L23.2852 -1.43066L24.7162 1.4315L11.5784 8.00042L24.7162 14.5693L23.2852 17.4315L8.0007 9.78927L-7.28376 17.4315L-8.71484 14.5693L4.42299 8.00042Z"
              fill="white"
            />
            <mask
              id="mask1_8979_5751"
              maskUnits="userSpaceOnUse"
              x="-8"
              y="0"
              width="32"
              height="16"
            >
              <path
                d="M8 8H24V16L8 8ZM8 8V16H-8L8 8ZM8 8H-8V0L8 8ZM8 8V0H24L8 8Z"
                fill="white"
              />
            </mask>
            <g mask="url(#mask1_8979_5751)">
              <path d="M-8 0L24 16L-8 0ZM24 0L-8 16L24 0Z" fill="black" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.61532 7.99996L-8.47656 0.95401L-7.52251 -0.954102L8.00046 6.80738L23.5234 -0.954102L24.4775 0.95401L10.3856 7.99996L24.4775 15.0459L23.5234 16.954L8.00046 9.19252L-7.52251 16.954L-8.47656 15.0459L5.61532 7.99996Z"
                fill="#C8102E"
              />
            </g>
            <path d="M8 0V16V0ZM-8 8H24H-8Z" fill="black" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.33333 5.33333V0H10.6667V5.33333H24V10.6667H10.6667V16H5.33333V10.6667H-8V5.33333H5.33333Z"
              fill="white"
            />
            <path d="M8 0V16V0ZM-8 8H24H-8Z" fill="black" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.4 6.4V0H9.6V6.4H24V9.6H9.6V16H6.4V9.6H-8V6.4H6.4Z"
              fill="#C8102E"
            />
          </g>
        </g>
      </g>
      <defs>
        <clipPath id="clip0_8979_5751">
          <rect width="16" height="16" rx="8" fill="white" />
        </clipPath>
        <clipPath id="clip1_8979_5751">
          <rect width="32" height="16" fill="white" transform="translate(-8)" />
        </clipPath>
      </defs>
    </svg>
  );
}
