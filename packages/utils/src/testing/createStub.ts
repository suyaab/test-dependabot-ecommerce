export function createStub<T>(defaults: T, overrides?: Partial<T>): T {
  return { ...defaults, ...overrides };
}
