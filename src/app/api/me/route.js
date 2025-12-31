import { getCurrentUser, updateProfile } from "../../backend/controllers/userController.js";

export async function GET(request) {
  return getCurrentUser(request);
}

export async function PATCH(request) {
  return updateProfile(request);
}