import { getCropById, deleteCrop } from "@/app/backend/controllers/recommenderController.js";

const createRes = () => ({
  json: (data) => new Response(JSON.stringify(data), { status: 200 }),
  status: (code) => ({
    json: (data) => new Response(JSON.stringify(data), { status: code }),
  }),
});

const getTokenFromCookies = (req) => {
  const cookieHeader = req.headers.get("cookie") || "";
  return cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];
};

// GET
export async function GET(req, context) {
  try {
    const { id } = await context.params;
    const token = getTokenFromCookies(req);
    const res = createRes();

    if (!id) return res.status(400).json({ error: "Crop ID is required" });

    return await getCropById(token, id, res);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// DELETE
export async function DELETE(req, context) {
  try {
    const { id } = await context.params;
    const token = getTokenFromCookies(req);
    const res = createRes();

    if (!id) return res.status(400).json({ error: "Crop ID is required" });

    return await deleteCrop(token, id, res);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}