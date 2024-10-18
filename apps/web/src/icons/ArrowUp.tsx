import { IconProps } from "./type";

export default function ArrowUp({ color = "#222731", className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={color}
        d="M5.9455 5.19139L1.62713 9.46537C1.2529 9.83575 0.649772 9.83423 0.277415 9.46198C-0.0677443 9.11692 -0.090827 8.57168 0.208219 8.19984L0.28079 8.11941L5.17109 3.27937C5.59291 2.86189 6.27102 2.85798 6.69763 3.27057L11.7114 8.11962C12.0622 8.4589 12.0943 9.00365 11.8015 9.38037L11.7303 9.46198C11.3623 9.83848 10.7592 9.84696 10.3808 9.48094L5.9455 5.19139Z"
      />
    </svg>
  );
}
