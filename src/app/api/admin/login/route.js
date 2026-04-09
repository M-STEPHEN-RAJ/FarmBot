import { loginAdmin } from "@/app/backend/controllers/adminAuthController";
import { initServer } from "@/app/backend/server";

export async function POST(req) {
  await initServer();
  return await loginAdmin(req);
}