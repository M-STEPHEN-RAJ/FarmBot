import { registerAdmin } from "@/app/backend/controllers/adminAuthController";
import { initServer } from "@/app/backend/server";

export async function POST(req) {
  await initServer();
  return await registerAdmin(req);
}