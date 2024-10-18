// Mock Pino Logger
vi.mock("@ecommerce/logger", () => ({
  default: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  getLogger: vi.fn().mockReturnValue({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

// Mock all console logs to hide Azure Functions logging
const consoleLogMock = vi
  .spyOn(console, "log")
  .mockImplementation(() => undefined);
const consoleWarnMock = vi
  .spyOn(console, "warn")
  .mockImplementation(() => undefined);
const consoleErrorMock = vi
  .spyOn(console, "error")
  .mockImplementation(() => undefined);

afterAll(() => {
  consoleLogMock.mockReset();
  consoleWarnMock.mockReset();
  consoleErrorMock.mockReset();
});
