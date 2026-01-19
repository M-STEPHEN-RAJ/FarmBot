import { connectDB } from "@/app/backend/config/db.js";
import { addAddress } from "@/app/backend/controllers/addressController";

export async function POST(request) {
  await connectDB();
  return addAddress(request);
}
