import { env } from "../../env";

// TODO: can we get Arvato to change this instead?
export default function getArvatoEnvironment() {
  switch (env.LINGO_ENV) {
    case "dev":
      return "DEV";

    case "qa":
      return "QA";

    case "stg":
      return "STAGE";

    case "prod":
      return "PROD";
  }
}
