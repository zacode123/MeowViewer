import type { Express } from "express";
import { createServer, type Server } from "http";
import axios from "axios";
import { catImageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Cat API route
  app.get("/api/cat", async (_req, res) => {
    try {
      // Request a medium sized image with consistent size
      const response = await axios.get("https://api.thecatapi.com/v1/images/search", {
        params: {
          size: "med",     // Medium sized images
          has_breeds: 0,   // Don't need breeds info
          mime_types: "jpg,png" // Only get jpg and png images
        }
      });
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

  // Image proxy route with improved headers for sharing and downloading
  app.get("/api/proxy-image", async (req, res) => {
    try {
      const imageUrl = req.query.url as string;
      const download = req.query.download === 'true';

      if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required" });
      }

      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer'
      });

      // Set appropriate headers
      res.set('Content-Type', response.headers['content-type']);
      res.set('Access-Control-Allow-Origin', '*');

      // If download parameter is present, set Content-Disposition
      if (download) {
        res.set('Content-Disposition', 'attachment; filename="cat.jpg"');
      } else {
        res.set('Content-Disposition', 'inline');
      }

      res.send(response.data);
    } catch (error) {
      console.error("Error proxying image:", error);
      res.status(500).json({ message: "Failed to proxy image" });
    }
  });

  // Get URL for sharing
  app.get("/api/share-url", async (req, res) => {
    try {
      const imageUrl = req.query.url as string;
      if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required" });
      }

      // Get the host URL from the request
      const protocol = req.protocol;
      const host = req.get('host');
      const shareUrl = `${protocol}://${host}/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;

      res.json({ shareUrl });
    } catch (error) {
      console.error("Error generating share URL:", error);
      res.status(500).json({ message: "Failed to generate share URL" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}