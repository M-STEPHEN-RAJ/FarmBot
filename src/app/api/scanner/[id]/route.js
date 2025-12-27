import { getScanById, deleteScan } from "@/app/backend/controllers/scannerController.js";

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

// GET /api/scanner/[id]
export async function GET(req, context) {
  try {
    const params = await context.params;
    const id = params.id;
    const token = getTokenFromCookies(req);
    const res = createRes();

    if (!id) return res.status(400).json({ error: "Scan ID is required" });

    return await getScanById(token, id, res);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// DELETE /api/scanner/[id]
export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const id = params.id;
    const token = getTokenFromCookies(req);
    const res = createRes();

    if (!id) return res.status(400).json({ error: "Scan ID is required" });

    return await deleteScan(token, id, res);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
