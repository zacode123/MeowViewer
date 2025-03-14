import { apiRequest } from "./queryClient";
import { CatImage } from "@shared/schema";

export async function fetchCatImage(): Promise<CatImage> {
  const response = await apiRequest("GET", "/api/cat");
  return response.json();
}
