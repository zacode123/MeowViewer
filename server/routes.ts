import type { Express } from "express";
import { createServer, type Server } from "http";
import axios from "axios";
import { catImageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Cat API route
  app.get("/api/cat", async (_req, res) => {
    try {
      const response = await axios.get("https://api.thecatapi.com/v1/images/search");
      const catData = response.data[0];
      
      const catImage = {
        id: catData.id,
        url: catData.url,
        width: catData.width,
        height: catData.height,
        attribution: "Image from The Cat API"
      };
      
      // Validate with our schema
      const parsed = catImageSchema.parse(catImage);
      
      res.json(parsed);
    } catch (error) {
      console.error("Error fetching cat image:", error);
      res.status(500).json({ message: "Failed to fetch cat image" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
