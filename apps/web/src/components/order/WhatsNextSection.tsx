import Icon, { IconName } from "~/components/Icon";

export default function WhatsNextSection({
  customerEmail,
  content,
}: {
  customerEmail: string | undefined;
  content: {
    title: string;
    items: {
      icon: string;
      title: string;
      description: string;
    }[];
    usernameLabel: string;
  };
}) {
  return (
    <section className="bg-linen pb-12 pt-8">
      <div className="grid-container">
        <div className="col-span-full lg:col-span-10 lg:col-start-2">
          <h3 className="subtitle mb-10 font-semibold">{content.title}</h3>

          <div className="grid grid-cols-3 gap-x-20">
            {content.items.map(({ icon, title, description }, index) => (
              <div
                key={icon}
                className="col-span-full text-charcoal/80 max-lg:mb-7 lg:col-span-1"
              >
                <Icon name={icon as IconName} className="mb-1 size-6" />

                <h4 className="mb-2 font-medium text-lg">{title}</h4>

                <p className="mb-2">{description}</p>
                {content.items.length - 1 === index &&
                  customerEmail != null &&
                  content.usernameLabel != null && (
                    <span className="break-all">
                      <strong className="mr-1 font-medium">
                        {content.usernameLabel}
                      </strong>
                      {customerEmail}
                    </span>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
