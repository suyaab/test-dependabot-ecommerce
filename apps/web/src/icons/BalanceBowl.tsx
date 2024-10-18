import { IconProps } from "./type";

export default function BalanceBowl({
  color = "#E5E0D7",
  className,
}: IconProps) {
  return (
    <svg
      width="69"
      height="133"
      viewBox="0 0 69 133"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M67.6603 99.0927C67.393 117.409 52.4618 132.175 34.082 132.175C15.7021 132.175 0.770971 117.409 0.503647 99.0927H67.6603Z"
        stroke={color}
      />
      <circle cx="34.2172" cy="72.3522" r="17.7582" stroke={color} />
      <circle cx="34.3528" cy="34.4861" r="11.4016" stroke={color} />
      <path
        d="M40.8859 7.70747C40.8859 11.3154 37.9611 14.2403 34.3531 14.2403C30.7451 14.2403 27.8203 11.3154 27.8203 7.70747C27.8203 4.09951 30.7451 1.17468 34.3531 1.17468C37.9611 1.17468 40.8859 4.09951 40.8859 7.70747Z"
        stroke={color}
      />
    </svg>
  );
}
