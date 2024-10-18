import { IconProps } from "./type";

export default function CircleMulti({
  color = "#009CDE",
  className,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      className={className}
    >
      <path
        d="M1.46484 12C1.46485 5.64872 6.61357 0.499998 12.9648 0.499999C19.3161 0.5 24.4648 5.64873 24.4648 12C24.4648 18.3513 19.3161 23.5 12.9648 23.5C6.61357 23.5 1.46484 18.3513 1.46484 12Z"
        stroke={color}
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M7.5 18C7.5 14.9624 9.96243 12.5 13 12.5C16.0376 12.5 18.5 14.9624 18.5 18C18.5 21.0376 16.0376 23.5 13 23.5C9.96243 23.5 7.5 21.0376 7.5 18Z"
        stroke={color}
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M4.5 15C4.5 10.3056 8.30558 6.5 13 6.5C17.6944 6.5 21.5 10.3056 21.5 15C21.5 19.6944 17.6944 23.5 13 23.5C8.30558 23.5 4.5 19.6944 4.5 15Z"
        stroke={color}
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
