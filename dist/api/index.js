import express from "express";
import axios from "axios";
import { z } from "zod";

// Validation schema (from drizzle/zod)
const catImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  width: z.number().optional(),
  height: z.number().optional(),
  attribution: z.string().optional()
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static frontend
app.use(express.static("public"));

// --- API routes ---
app.get("/api/cat", async (_req, res) => {
  try {
    const response = await axios.get("https://api.thecatapi.com/v1/images/search", {
      params: { size: "med", has_breeds: 0, mime_types: "jpg,png" }
    });
    const catData = response.data[0];
    const catImage = {
      id: catData.id,
      url: catData.url,
      width: catData.width,
      height: catData.height,
      attribution: "Image from The Cat API"
    };
    res.json(catImageSchema.parse(catImage));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cat image" });
  }
});

app.get("/api/proxy-image", async (req, res) => {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl) return res.status(400).json({ message: "Image URL is required" });

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    res.set("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to proxy image" });
  }
});

app.get("/api/share-url", (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).json({ message: "Image URL is required" });
  }
  const protocol = req.protocol;
  const host = req.get("host");
  const shareUrl = `${protocol}://${host}/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
  res.json({ shareUrl });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
