import Link from "next/link";

import { FeatBlogEntry } from "@ecommerce/cms";

import Hyperlink from "~/components/Hyperlink";
import ResponsiveImage from "~/components/ResponsiveImage";

export default function FeatBlogArticle({
  title,
  link,
  image,
  cat,
  button,
}: FeatBlogEntry & { button: { label: string; variant: string } }) {
  return (
    <div className="flex flex-col-reverse border-b lg:container lg:flex-row lg:pr-0">
      <div className="mb-20 mr-10 mt-10 pl-6 text-left lg:my-auto lg:w-1/4">
        <Link href={cat.url} className="mb-4 inline-block opacity-60">
          {cat.name}
        </Link>
        <Link href={link} className="mb-8 inline-block">
          <h4>{title}</h4>
        </Link>
        <Hyperlink text={button.label} url={link} variant={button.variant} />
      </div>

      <ResponsiveImage
        className="lg:w-3/4"
        url={image.url}
        desktopUrl={image.desktopUrl}
        alt={image.alt}
        width={image.width}
        desktopWidth={image.desktopWidth}
        height={image.height}
        desktopHeight={image.desktopHeight}
      />
    </div>
  );
}
