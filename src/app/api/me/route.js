import { getCurrentUser } from "../../backend/controllers/userController.js";

export async function GET(request) {
  return getCurrentUser(request);
}
