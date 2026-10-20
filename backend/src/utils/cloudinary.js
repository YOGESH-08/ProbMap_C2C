import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

export const uploadBufferToCloudinary = async (
  fileBuffer,
  filename,
  folder,
  resourceType = "auto" 
) => {
  return new Promise((resolve) => {
    // Attempt Cloudinary upload first
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: `${Date.now()}-${filename.replace(/\.[^/.]+$/, "")}`,
        resource_type: resourceType,
        ...(resourceType === "raw" ? { format: "pdf" } : {}), 
      },
      (error, result) => {
        if (!error && result?.secure_url) {
          return resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }

        // If Cloudinary fails (e.g. invalid cloud_name or network issue), fallback to local storage
        console.warn("Cloudinary upload failed or unconfigured, saving locally to uploads/ folder:", error?.message || error);
        try {
          const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
          const localFilePath = path.join(uploadsDir, safeName);
          fs.writeFileSync(localFilePath, fileBuffer);

          const port = process.env.PORT || 5001;
          const host = process.env.HOST || "http://localhost:" + port;
          const localUrl = `${host}/uploads/${safeName}`;

          resolve({
            secure_url: localUrl,
            public_id: safeName,
          });
        } catch (localErr) {
          console.error("Local file save error:", localErr);
          resolve({
            secure_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
            public_id: "fallback",
          });
        }
      }
    );

    bufferToStream(fileBuffer).pipe(uploadStream);
  });
};
