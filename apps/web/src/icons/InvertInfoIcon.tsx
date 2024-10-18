interface IconProps {
  color?: string;
}

export default function InvertInfoIcon({ color = "#EE0000" }: IconProps) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 6C0 9.31371 2.68629 12 6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6ZM5.4 3.6V6C5.4 6.33137 5.66863 6.6 6 6.6C6.33137 6.6 6.6 6.33137 6.6 6V3.6C6.6 3.26863 6.33137 3 6 3C5.66863 3 5.4 3.26863 5.4 3.6ZM6 9C6.41421 9 6.75 8.66421 6.75 8.25C6.75 7.83579 6.41421 7.5 6 7.5C5.58579 7.5 5.25 7.83579 5.25 8.25C5.25 8.66421 5.58579 9 6 9Z"
        fill={color}
      />
    </svg>
  );
}
