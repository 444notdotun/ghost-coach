import { post } from "./client.js";

export function login(email, password) {
  return post("/authController/login", { email, password });
}

export function register(formData) {
  return post("/authController/register", formData);
}
