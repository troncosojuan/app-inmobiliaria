import { vi } from "vitest";

function createMockDelegate() {
  return {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    count: vi.fn(),
    upsert: vi.fn(),
    createMany: vi.fn(),
  };
}

export const mockPrisma = {
  tenant: createMockDelegate(),
  property: createMockDelegate(),
  propertyImage: createMockDelegate(),
  propertyView: createMockDelegate(),
  lead: createMockDelegate(),
  user: createMockDelegate(),
  plan: createMockDelegate(),
  customPage: createMockDelegate(),
  task: createMockDelegate(),
  activity: createMockDelegate(),
  apiKey: createMockDelegate(),
  subscription: createMockDelegate(),
  webhook: createMockDelegate(),
  searchAlert: createMockDelegate(),
  portalChannel: createMockDelegate(),
  portalPublication: createMockDelegate(),
};

vi.mock("@app-inmobiliaria/db", () => ({
  prisma: mockPrisma,
}));

vi.mock("nodemailer", () => ({
  createTransport: () => ({
    sendMail: vi.fn().mockResolvedValue({ messageId: "test" }),
  }),
}));
