import { NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db.js";
import { updateAddress, deleteAddress } from "@/app/backend/controllers/addressController.js";

export async function PATCH(req, context) {
  try {
    await connectDB();

    const params = await context.params;
    const addressId = params.id;

    if (!addressId) {
      return NextResponse.json(
        { message: "Address ID is required!" },
        { status: 400 }
      );
    }

    const response = await updateAddress(req, addressId);
    return response;
  } catch (err) {
    console.error("PATCH Address Error:", err);
    return NextResponse.json(
      { message: err.message || "Failed to update address!" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  try {
    await connectDB();

    const params = await context.params;
    const addressId = params.id;

    if (!addressId) {
      return NextResponse.json(
        { message: "Address ID is required!" },
        { status: 400 }
      );
    }

    const response = await deleteAddress(req, addressId);
    return response;
  } catch (err) {
    console.error("DELETE Address Error:", err);
    return NextResponse.json(
      { message: err.message || "Failed to delete address!" },
      { status: 500 }
    );
  }
}
