import AbbottLogo from "~/icons/AbbottLogo";
import AlertIcon from "~/icons/AlertIcon";
import ArrowDown from "~/icons/ArrowDown";
import ArrowRight from "~/icons/ArrowRight";
import ArrowUp from "~/icons/ArrowUp";
import BalanceBowl from "~/icons/BalanceBowl";
import Calories from "~/icons/Calories";
import Checkmark from "~/icons/Checkmark";
import ChevronDown from "~/icons/ChevronDown";
import CircleArcs from "~/icons/CircleArcs";
import CircleBiosensor from "~/icons/CircleBiosensor";
import CircleBiosensorDashed from "~/icons/CircleBiosensorDashed";
import CircleClock from "~/icons/CircleClock";
import CircleDouble from "~/icons/CircleDouble";
import CircleExclamation from "~/icons/CircleExclamation";
import CircleGraph from "~/icons/CircleGraph";
import CircleMulti from "~/icons/CircleMulti";
import CirclePlank from "~/icons/CirclePlank";
import CirclePowerPlug from "~/icons/CirclePowerPlug";
import CircleRockStack from "~/icons/CircleRockStack";
import CircleTarget from "~/icons/CircleTarget";
import CircleTree from "~/icons/CircleTree";
import CircleUmbrella from "~/icons/CircleUmbrella";
import CloseIcon from "~/icons/CloseIcon";
import Day from "~/icons/Day";
import FDACleared from "~/icons/FDACleared";
import HSAFSA from "~/icons/HSAFSA";
import InfoIcon from "~/icons/InfoIcon";
import InvertInfoIcon from "~/icons/InvertInfoIcon";
import LingoLogo from "~/icons/LingoLogo";
import MadeByAbbott from "~/icons/MadeByAbbott";
import MagnifyingIcon from "~/icons/MagnifyingIcon";
import Mail from "~/icons/Mail";
import MenuIcon from "~/icons/MenuIcon";
import MinusIcon from "~/icons/MinusIcon";
import PlusIcon from "~/icons/PlusIcon";
import ShippingTruck from "~/icons/ShippingTruck";
import Spinner from "~/icons/Spinner";
import ThumbsUp from "~/icons/ThumbsUp";
import { type IconProps } from "~/icons/type";
import UKFlag from "~/icons/UKFlag";
import User from "~/icons/User";
import USFlag from "~/icons/USFlag";

export const IconElementsMap = {
  AbbottLogo,
  AlertIcon,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BalanceBowl,
  Calories,
  Checkmark,
  ChevronDown,
  CircleArcs,
  CircleBiosensor,
  CircleBiosensorDashed,
  CircleClock,
  CircleDouble,
  CircleExclamation,
  CircleGraph,
  CircleMulti,
  CirclePlank,
  CirclePowerPlug,
  CircleRockStack,
  CircleTarget,
  CircleTree,
  CircleUmbrella,
  CloseIcon,
  Day,
  FDACleared,
  HSAFSA,
  InfoIcon,
  InvertInfoIcon,
  LingoLogo,
  MadeByAbbott,
  MagnifyingIcon,
  Mail,
  MenuIcon,
  MinusIcon,
  PlusIcon,
  ShippingTruck,
  Spinner,
  ThumbsUp,
  User,
  USFlag,
  UKFlag,
};

export type IconName = keyof typeof IconElementsMap;

export function getValidIconName(icon: string): IconName | undefined {
  return Object.prototype.hasOwnProperty.call(IconElementsMap, icon)
    ? (icon as IconName)
    : undefined;
}

export type IconNamesEnum =
  | "AbbottLogo"
  | "AlertIcon"
  | "ArrowDown"
  | "ArrowRight"
  | "ArrowUp"
  | "BalanceBowl"
  | "Calories"
  | "Checkmark"
  | "ChevronDown"
  | "CircleArcs"
  | "CircleBiosensor"
  | "CircleBiosensorDashed"
  | "CircleClock"
  | "CircleDouble"
  | "CircleExclamation"
  | "CircleGraph"
  | "CircleMulti"
  | "CirclePlank"
  | "CirclePowerPlug"
  | "CircleRockStack"
  | "CircleTarget"
  | "CircleTree"
  | "CircleUmbrella"
  | "CloseIcon"
  | "Day"
  | "FDACleared"
  | "HSAFSA"
  | "InfoIcon"
  | "InvertInfoIcon"
  | "LingoLogo"
  | "MadeByAbbott"
  | "MagnifyingIcon"
  | "Mail"
  | "MenuIcon"
  | "MinusIcon"
  | "PlusIcon"
  | "ShippingTruck"
  | "Spinner"
  | "ThumbsUp"
  | "User"
  | "USFlag"
  | "UKFlag";

export interface Props extends IconProps {
  name: IconNamesEnum;
}

export default function Icon({ name, color, className }: Props) {
  const IconElement = IconElementsMap[name];

  return (
    <IconElement
      className={className ?? undefined}
      color={color ?? undefined}
    />
  );
}
