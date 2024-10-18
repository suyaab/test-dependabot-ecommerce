import { Breadcrumbs } from "~/components/Breadcrumbs";
import Hyperlink from "~/components/Hyperlink";
import ButtonComponents from "~/app/(home)/dashboard/ui/Buttons";
import AbbottLogo from "~/icons/AbbottLogo";
import ArrowRight from "~/icons/ArrowRight";
import CircleBiosensor from "~/icons/CircleBiosensor";
import CircleBiosensorDashed from "~/icons/CircleBiosensorDashed";
import CircleClock from "~/icons/CircleClock";
import CircleDouble from "~/icons/CircleDouble";
import CircleGraph from "~/icons/CircleGraph";
import CircleMulti from "~/icons/CircleMulti";
import CirclePlank from "~/icons/CirclePlank";
import CirclePowerPlug from "~/icons/CirclePowerPlug";
import CircleTarget from "~/icons/CircleTarget";
import CircleUmbrella from "~/icons/CircleUmbrella";
import CloseIcon from "~/icons/CloseIcon";
import LingoLogo from "~/icons/LingoLogo";
import MadeByAbbott from "~/icons/MadeByAbbott";
import MagnifyingIcon from "~/icons/MagnifyingIcon";
import MenuIcon from "~/icons/MenuIcon";
import MinusIcon from "~/icons/MinusIcon";
import PlusIcon from "~/icons/PlusIcon";
import isDashboardEnabled from "../isDashboardEnabled";
import InputComponents from "./Inputs";

export default async function Home() {
  await isDashboardEnabled();

  return (
    <>
      <div className="container">
        <Breadcrumbs
          links={[
            {
              text: "Dashboard",
              url: "/dashboard",
            },
            {
              text: "UI Components",
              url: "/dashboard/ui",
            },
          ]}
        />
      </div>

      {/* Buttons Example */}
      <ButtonComponents />

      {/* Links Example */}
      <section className="container my-8 mb-20">
        <div className="flex w-1/3 items-center justify-between">
          <div className="bg-charcoal p-4">
            <Hyperlink text="Light" url="/dashboard/ui" variant="light" />
          </div>
          <Hyperlink text="Dark" url="/dashboard/ui" variant="dark" />
          <Hyperlink text="Outline" url="/dashboard/ui" variant="outline" />
        </div>
      </section>

      {/* Inputs Example */}
      <InputComponents />

      {/* Icons */}
      <section className="container my-20 flex flex-wrap items-center gap-2 bg-red-200">
        <AbbottLogo className="size-12" />
        <ArrowRight className="size-12" />
        <CircleBiosensor className="size-12" />
        <CircleBiosensorDashed className="size-12" />
        <CircleGraph className="size-4" />
        <CircleMulti className="size-4" />
        <CircleTarget className="size-6" />
        <CircleUmbrella className="size-8" />
        <CircleClock className="size-12" />
        <CirclePowerPlug className="size-12" />
        <CirclePlank className="size-12" />
        <CircleDouble className="size-12" />
        <CloseIcon />
        <LingoLogo />
        <MadeByAbbott />
        <MagnifyingIcon className="size-12" />
        <MenuIcon className="size-8" />
        <MinusIcon className="size-8" />
        <PlusIcon className="size-8" />
      </section>

      {/* Design System Examples */}
      <div className="container my-10 flex justify-stretch gap-20">
        <div className="grow">
          <h1>This is heading H1.</h1>
          <h2>This is heading H2.</h2>
          <h3>This is heading H3.</h3>
          <h4>This is heading H4.</h4>
          <h5>This is heading H5.</h5>
          <h6>This is heading H6.</h6>

          <br className="my-8 block" />
          <p>
            Some text in <span className="font-light">Light | MatterLight</span>
          </p>
          <p>
            Some text in{" "}
            <span className="font-normal">Normal | MatterRegular</span>
          </p>
          <p>
            Some text in{" "}
            <span className="font-semibold">Semibold | MatterSembiold</span>
          </p>

          <br className="my-8 block" />

          <p className="text-base">text-base</p>
          <p className="text-sm">text-sm</p>
          <p className="text-xs">text-xs</p>

          <hr className="my-8" />

          <p>
            This text is <i>italic</i>.
          </p>
          <p>
            This text is <em>emphasized</em>.
          </p>
          <p>
            This text is <b>bold</b>.
          </p>
          <p>
            The text is <strong>strong</strong>.
          </p>
          <p>
            This text is <u>underlined</u>.
          </p>
          <p>
            This text is <mark>marked</mark>.
          </p>
          <p>
            This text is <sup>superscripted</sup>.
          </p>
          <p>
            This text is <sub>subscripted</sub>.
          </p>
          <p>
            This text is <del>deleted</del>.
          </p>
          <p>
            This text is <del>deleted</del>
            <ins>inserted</ins>.
          </p>
          <p>
            This text is <big>bigger</big>.
          </p>
          <p>
            This text is <small>smaller</small>.
          </p>
        </div>

        <div className="grow">
          <ul className="mb-20">
            <li className="bg-charcoal p-4 text-xs text-white">
              Charcoal Default
            </li>
            <li className="bg-charcoal/90 p-4 text-xs text-white">
              Charcoal 90%
            </li>
            <li className="bg-charcoal/80 p-4 text-xs text-white">
              Charcoal 80%
            </li>
            <li className="bg-charcoal/70 p-4 text-xs text-white">
              Charcoal 70%
            </li>
            <li className="bg-charcoal/60 p-4 text-xs text-white">
              Charcoal 60%
            </li>
            <li className="bg-charcoal/50 p-4 text-xs text-white">
              Charcoal 50%
            </li>
            <li className="bg-charcoal/40 p-4 text-xs text-charcoal">
              Charcoal 40%
            </li>
            <li className="bg-charcoal/30 p-4 text-xs text-charcoal">
              Charcoal 30%
            </li>
            <li className="bg-charcoal/20 p-4 text-xs text-charcoal">
              Charcoal 20%
            </li>
            <li className="bg-charcoal/10 p-4 text-xs text-charcoal">
              Charcoal 10%
            </li>
          </ul>
          <ul className="mb-20 bg-charcoal">
            <li className="bg-linen p-4 text-xs text-charcoal">Linen</li>
            <li className="bg-linen-light p-4 text-xs text-charcoal">
              Linen Light
            </li>
            <li className="bg-green p-4 text-xs text-white">Green</li>
            <li className="bg-blue p-4 text-xs text-white">Blue</li>
            <li className="bg-red p-4 text-xs text-white">Red</li>
            <li className="bg-orange p-4 text-xs text-white">Orange</li>
            <li className="bg-yellow p-4 text-xs text-white">Yellow</li>
          </ul>
        </div>
      </div>

      <section className="text-center text-xs">
        <div className="container bg-rose-500 py-3 text-white">container</div>

        <div className="grid-container my-8 bg-cyan-200 text-center">
          <div className="bg-yellow-100 p-3">c-1</div>
          <div className="bg-yellow-200 p-3">c-2</div>
          <div className="bg-yellow-300 p-3">c-3</div>
          <div className="bg-yellow-400 p-3">c-4</div>
          <div className="bg-yellow-500 p-3">c-5</div>
          <div className="bg-yellow-600 p-3">c-6</div>
          <div className="bg-orange-100 p-3">c-7</div>
          <div className="bg-orange-200 p-3">c-8</div>
          <div className="bg-orange-300 p-3">c-9</div>
          <div className="bg-orange-400 p-3">c-10</div>
          <div className="no-r-gap col-span-2 bg-orange-700 p-3 text-white">
            no gap
          </div>
        </div>

        <div className="grid-container my-8 bg-red-200 text-center">
          <div className="no-l-gap col-span-2 bg-purple-700 p-3 text-white">
            no gap
          </div>
          <div className="bg-purple-500 p-3">c-3</div>
          <div className="bg-purple-400 p-3">c-4</div>
          <div className="bg-purple-300 p-3">c-5</div>
          <div className="bg-purple-200 p-3">c-6</div>
          <div className="bg-pink-100 p-3">c-7</div>
          <div className="bg-pink-200 p-3">c-8</div>
          <div className="bg-pink-300 p-3">c-9</div>
          <div className="bg-pink-400 p-3">c-10</div>
          <div className="bg-pink-500 p-3">c-11</div>
          <div className="bg-pink-600 p-3">c-12</div>
        </div>

        <div className="mx-auto max-w-screen-sm bg-lime-300 py-3">
          Max sm (640)
        </div>
        <div className="mx-auto max-w-screen-md bg-teal-300 py-3">
          Max md (768)
        </div>
        <div className="mx-auto max-w-screen-lg bg-green-200 py-3">
          Max lg (1024)
        </div>
        <div className="mx-auto max-w-screen-xl bg-red-100 py-3">
          Max xl (1280)
        </div>
        <div className="mx-auto max-w-screen-xxl bg-cyan-400 py-3">
          Max xxl (by design = 1440)
        </div>
        <div className="mx-auto max-w-screen-fhd bg-pink-300 py-3">
          Max fhd (1920)
        </div>
        <div className="mx-auto max-w-screen-qhd bg-purple-300 py-3">
          Max qhd (2560)
        </div>
        <div className="mx-auto max-w-screen-uwqhd bg-blue-200 py-3">
          Max uwqhd (3440)
        </div>
        <div className="mx-auto max-w-screen-uwqhd bg-rose-400 py-3">
          Max uhd (3840)
        </div>
      </section>
    </>
  );
}
