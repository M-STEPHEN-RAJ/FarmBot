import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Add Address
export const addAddress = async (request) => {
  try {
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/(^|;\s*)token=([^;]+)/);
    const token = match?.[2];

    if (!token)
      return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user)
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });

    if (!Array.isArray(user.addressHistory)) user.addressHistory = [];

    const addressData = await request.json();

    // push returns the subdocument with _id
    const addedAddress = user.addressHistory.create(addressData);
    user.addressHistory.push(addedAddress);

    if (!user.defaultShippingAddress || !user.defaultShippingAddress.addressLine) {
      user.defaultShippingAddress = addedAddress;
    }

    await user.save();

    return new Response(JSON.stringify({ message: "Address added!", user }), { status: 201 });
  } catch (err) {
    console.error("Add address error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
};

// Update Address
export const updateAddress = async (request, id) => {
  try {
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/(^|;\s*)token=([^;]+)/);
    const token = match?.[2];

    if (!token)
      return new Response(JSON.stringify({ message: "Not authenticated" }), {
        status: 401,
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    const address = user.addressHistory.id(id);
    if (!address)
      return new Response(JSON.stringify({ message: "Address not found" }), {
        status: 404,
      });

    const updates = await request.json();
    Object.assign(address, updates);

    if (
      user.defaultShippingAddress &&
      user.defaultShippingAddress._id.toString() === id
    ) {
      user.defaultShippingAddress = address;
    }

    await user.save();

    return new Response(
      JSON.stringify({ message: "Address updated", user }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Update address error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
};

// Delete Address
export const deleteAddress = async (request, id) => {
  try {
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/(^|;\s*)token=([^;]+)/);
    const token = match?.[2];

    if (!token)
      return new Response(JSON.stringify({ message: "Not authenticated" }), {
        status: 401,
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    user.addressHistory = user.addressHistory.filter(
      (addr) => addr._id.toString() !== id
    );

    if (
      user.defaultShippingAddress &&
      user.defaultShippingAddress._id.toString() === id
    ) {
      user.defaultShippingAddress = user.addressHistory[0] || null;
    }

    await user.save();

    return new Response(
      JSON.stringify({ message: "Address deleted", user }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete address error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
};

// Default Address
export const setDefaultAddress = async (request, id) => {
  try {
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/(^|;\s*)token=([^;]+)/);
    const token = match?.[2];

    if (!token)
      return new Response(JSON.stringify({ message: "Not authenticated" }), {
        status: 401,
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    const address = user.addressHistory.id(id);
    if (!address)
      return new Response(JSON.stringify({ message: "Address not found" }), {
        status: 404,
      });

    user.defaultShippingAddress = address;
    await user.save();

    return new Response(
      JSON.stringify({
        message: "Default address updated",
        defaultShippingAddress: address,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Set default address error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
};
