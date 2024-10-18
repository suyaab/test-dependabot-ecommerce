export const mockOrderConfirmationContent = {
  header: {
    title: "Welcome to Lingo",
    description:
      "Your order in now being processed, it usually takes 5-7 business days to be shipped. We’ll send you a shipping confirmation email as soon as its on its way",
  },
  whatsNext: {
    title: "What’s next?",
    items: [
      {
        icon: "Mail",
        title: "Check your inbox",
        description:
          "We will send you emails containing your order confirmation number, delivery status, and receipt.",
      },
      {
        icon: "ArrowDown",
        title: "Download the app",
        description:
          "Once your package arrives download the Lingo app to start your journey. We’ll remind you via email with a direct download link",
      },
      {
        icon: "User",
        title: "App access",
        description:
          "Gain access to the Lingo app by using the email address associated with your purchase",
      },
    ],
    usernameLabel: "Username:",
  },
  confirmation: {
    title: "Order confirmation:",
    fulfilled: "Order fulfilled by",
    delivery: "Estimated Delivery",
  },
  payment: {
    title: "Payment",
    subtotal: "Subtotal",
    shipping: "Shipping",
    tax: "Tax",
    total: "Total",
    expire: "Expires",
  },
  billing: {
    title: "Billing",
  },
  shipping: {
    title: "Shipping info",
  },
  footer: {
    title: "Have questions?",
    description:
      "Call us at 1-888-764-7684, 9am to 9pm EST - Monday through Friday, and 9am to 5pm EST - Saturday and Sunday; excluding holidays. Email us at <a href='mailto:lingosupport-us@hellolingo.com'>lingosupport-us@hellolingo.com</a>.",
  },
  failedToFetch: "Failed to fetch order data",
};
