import { createScheme, getAllSchemes } from "@/app/backend/controllers/schemeController.js";

export async function POST(request) {
  return createScheme(request);
}

export async function GET(request) {
  return getAllSchemes(request);
}