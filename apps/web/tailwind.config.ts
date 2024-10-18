import type { Config } from "tailwindcss";

import baseConfig from "@ecommerce/tailwind-config";

const config: Pick<Config, "content" | "presets"> = {
  presets: [baseConfig],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
};

export default config;
