import { SignupSource, SignupSourcesSchema } from "../MarketingService";

export const createSignupSourceStub = (): SignupSource => {
  const signupSources: SignupSource[] = SignupSourcesSchema.options.map(
    (option) => option.value,
  );

  return signupSources[Math.floor(Math.random() * signupSources.length)]!;
};
