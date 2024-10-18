import configConventional from "@commitlint/config-conventional";
import type { UserConfig } from "@commitlint/types";

// Dynamically fetch the conventional commit types
const commitTypes = Object.keys(configConventional.prompt.questions.type.enum);
const commitTypesPattern = commitTypes.join("|");

// Define the regex pattern
const prTitleWithJiraPattern = new RegExp(
  `^(${commitTypesPattern})\\((\\d{5,6}|nojira|no-jira|NOJIRA|NO-JIRA)\\): \\S.+$`,
);

// // Here are some examples of valid and invalid PR titles
// const exampleHeaders = [
//   ["feat(12345): Add new feature", true],
//   ["feat(nojira): Add new feature", true],
//   ["feat(no-jira): Add new feature", true],
//   ["feat(NOJIRA): Add new feature", true],
//   ["feat(NO-JIRA): Add 32432 234new feature", true],
//   ["feat(12345): Add new featu2,re", true],
//   ["feat(nojira): Add new featu+re", true],
//   ["feat: broken", false],
//   ["feat(1234): broken", false],
//   ["feat(12345): ", false],
//   ["feat(12345):", false],
//   ["feat(12345):  ", false],
//   ["feat(12345):  df", false],
//   ["feat(1234523): y", false]
// ]

// Define the error message
const ErrorMessage =
  "The PR title must follow the conventional commit pattern: <type>(<ticket>): <subject>\n" +
  `- <type> is one of: [${commitTypes.join(", ")}]\n` +
  "- <ticket> is required Jira ticket number or 'nojira'\n" +
  "- <subject> is required and can be anything as long as first character after colon is not whitespace\n" +
  "- Examples:\n" +
  "feat(12345): adds feature xyz\n" +
  "chore(nojira): removes unused function foo\n";

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-empty": [0, "never"],
    "subject-empty": [0, "never"],
    "subject-case": [0, "never", "lower-case"],
    "header-case": [0, "never", "lower-case"],
    "header-max-length": [0, "always", 100],
    "pr-title-with-jira-format": [2, "always"],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: prTitleWithJiraPattern,
    },
  },
  plugins: [
    {
      rules: {
        "pr-title-with-jira-format": ({ header, raw }) => {
          if (raw == null || header == null) {
            return [false, "The PR title must not be empty."];
          }
          const isDependabot = raw.includes("dependabot[bot]");
          if (isDependabot) {
            return [true, ""];
          }
          const isValid = prTitleWithJiraPattern.test(header);
          return [isValid, isValid ? "" : ErrorMessage];
        },
      },
    },
  ],
};

export default Configuration;
