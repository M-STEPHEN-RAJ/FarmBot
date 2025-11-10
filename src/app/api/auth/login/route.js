import { loginUser } from "@/app/backend/controllers/authController";
import { initServer } from "@/app/backend/server";

export async function POST(req) {
  await initServer();
  return await loginUser(req);
}
