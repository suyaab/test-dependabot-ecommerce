interface EmptyCartProps {
  href?: string;
}

export default function EmptyCart({ href = "/products" }: EmptyCartProps) {
  return (
    <div className="container">
      <div className="container">
        <div className="flex h-96 w-full flex-col justify-center">
          <div className="flex flex-col lg:w-1/2">
            <h1 className="headline mb-4">Empty Cart</h1>
          </div>

          <p className="mb-4 lg:w-1/2">
            You have made it to our checkout page without selecting a plan.
            Please use the button below to continue shopping
          </p>

          <a className="button-dark mt-6 lg:w-1/5" href={href}>
            Shop Lingo
          </a>
        </div>
      </div>
    </div>
  );
}
