import { ServiceLocator } from "@ecommerce/cms";

import FeatBlogArticle from "~/components/FeatBlogArticle";

export default async function BlogContent() {
  const cms = ServiceLocator.getCMS();

  const { subTitle, title, button, featBlogEntries } =
    await cms.getHomeBlogContent();

  return (
    <>
      <div className="border-y pl-6 pt-32 lg:container">
        <p className="subtitle">{subTitle}</p>
        <h2 className="mb-14">{title}</h2>
      </div>
      {featBlogEntries.map(({ title, link, image, cat }) => (
        <FeatBlogArticle
          title={title}
          link={link}
          image={image}
          key={title}
          cat={cat}
          button={button}
        />
      ))}
    </>
  );
}
