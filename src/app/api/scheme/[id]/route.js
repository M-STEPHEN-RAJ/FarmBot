import { getSchemeById } from "@/app/backend/controllers/schemeController.js";

export async function GET(request, context) {
  return getSchemeById(request, context);
}