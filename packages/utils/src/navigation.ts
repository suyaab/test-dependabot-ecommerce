import { LingoEnv } from "./environments";

export function getShopUrlByEnv(env: LingoEnv) {
  switch (env) {
    case "dev":
      return "https://shop-d.hellolingo.com";
    case "qa":
      return "https://shop-q.hellolingo.com";
    case "stg":
      return "https://shop-s.hellolingo.com";
    default:
      return "https://shop.hellolingo.com";
  }
}

export function getWebUrlByEnv(env: LingoEnv) {
  switch (env) {
    case "dev":
      return "https://dev.hellolingo.com";
    case "qa":
      return "https://qa.hellolingo.com";
    case "stg":
      return "https://stg.hellolingo.com";
    default:
      return "https://www.hellolingo.com";
  }
}
