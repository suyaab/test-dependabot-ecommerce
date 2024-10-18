import Image from "next/image";

import { LocationAttributes } from "@ecommerce/analytics";
import { ProductDecideDialogContent } from "@ecommerce/cms";

import {
  Dialog,
  DialogCloseIcon,
  DialogContent,
  DialogTrigger,
} from "~/components/Dialog";
import Icon, { IconNamesEnum } from "~/components/Icon";
import cn from "~/lib/utils";

export default function ProductDecideDialog(props: ProductDecideDialogContent) {
  const { items, image, title, description, triggerContent } = props;
  return (
    <Dialog>
      <DialogTrigger
        asChild
        data-analytics-location={LocationAttributes.SKU_HIGHLIGHT}
      >
        <div className="mt-8 flex cursor-pointer items-center justify-between rounded bg-linen px-8 py-3 text-sm leading-6 transition-all duration-300 hover:pr-6">
          <p>{triggerContent.title}</p>
          <div className="inline-block rounded-3xl bg-linen-light p-1">
            <Icon
              name={triggerContent.iconName as IconNamesEnum}
              className="size-3"
            />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="flex max-h-full w-full border-none bg-linen-light p-0 lg:h-auto lg:max-w-screen-xxl">
        <div className="relative hidden min-h-[750px] w-1/3 lg:block">
          <Image
            className="hidden object-cover lg:block"
            src={image.desktopUrl}
            sizes="30vw"
            alt={image.alt}
            fill
          />
        </div>
        <div className="overflow-auto px-8 py-12 lg:mt-0 lg:w-2/3 lg:justify-center">
          <div className="mt-10 lg:mb-8 lg:mt-20">
            <h2 className="headline mb-6 font-semibold lg:mb-3">{title}</h2>
            <div
              className="text-charcoal/70 [&>p]:mb-5"
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          </div>
          <ul className="my-6 flex gap-12 text-sm max-lg:flex-col">
            {items.map((item) => (
              <li
                key={item.title}
                className="flex flex-col items-start space-y-4"
              >
                <Icon
                  name={item.iconName as IconNamesEnum}
                  className="size-11"
                />
                <h3 className="text-base text-charcoal/70">{item.title}</h3>

                <h4 className="font-semibold text-lg">{item.eyebrow}</h4>

                <p
                  className={cn(
                    "rounded bg-charcoal/80 px-2 py-1 font-medium text-xs text-white",
                    { "bg-blue": item.autoRenews },
                  )}
                >
                  {item.tag}
                </p>

                <p className="text-charcoal/70">{item.details}</p>

                <p className="!mt-1 font-semibold text-charcoal/70">
                  {item.cgmDetails}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <DialogCloseIcon className="[&>svg]:bg-linen" />
      </DialogContent>
    </Dialog>
  );
}
