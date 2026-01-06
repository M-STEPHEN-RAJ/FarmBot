import { loginSeller } from "@/app/backend/controllers/sellerAuthController";
import { initServer } from "@/app/backend/server";

export async function POST(req) {
  await initServer();
  return await loginSeller(req);
}
