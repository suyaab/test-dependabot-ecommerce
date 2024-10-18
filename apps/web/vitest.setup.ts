import "@testing-library/jest-dom/extend-expect";

const mockLogger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  child: vi.fn().mockReturnThis(),
};

vi.mock("@ecommerce/logger", () => ({
  default: mockLogger,
  getLogger: vi.fn().mockReturnValue(mockLogger),
}));
