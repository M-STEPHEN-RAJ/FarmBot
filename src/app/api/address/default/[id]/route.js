import { connectDB } from "@/app/backend/config/db";
import { setDefaultAddress } from "@/app/backend/controllers/addressController";

export async function PATCH(req, context) {
  await connectDB();

  const { id: addressId } = await context.params;

  return setDefaultAddress(req, addressId);
}
