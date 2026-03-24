import { getAutoFillData } from "@/app/backend/controllers/recommenderController.js";

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

export async function GET(req) {
  try {
    const token = getTokenFromCookies(req);
    const res = createRes();

    return getAutoFillData(token, res);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}