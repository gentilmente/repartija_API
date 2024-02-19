const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");
const cors = require("cors");
const { Readable } = require("stream"); // Import Readable from the 'stream' module
const app = express();
const port = 3000;
require("dotenv").config();
console.log(process.env);
app.use(cors());

// Initialize multer with memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Configure Google Drive Service Account
const serviceAccount = require("./credentials.json"); // Update the path to your service account file
const scopes = ["https://www.googleapis.com/auth/drive.file"]; // Ensure the scope is correct for uploading files
const auth = new google.auth.JWT(
  process.env.CLIENT_EMAIL,
  null,
  process.env.PRIVATE_KEY,
  scopes
);
const drive = google.drive({ version: "v3", auth });

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const file = req.file;
  const folderId = process.env.FOLDER_ID; // Replace with your Google Drive folder ID

  const fileMetadata = {
    name: file.originalname,
    parents: [folderId],
  };

  // Convert the buffer to a stream
  const media = {
    mimeType: file.mimetype,
    body: Readable.from(file.buffer),
  };

  drive.files.create(
    {
      resource: fileMetadata,
      media: media,
      fields: "id",
    },
    (err, file) => {
      if (err) {
        console.error("Error uploading to Google Drive:", err);
        return res.status(500).send({
          message: "Error uploading to Google Drive.",
          error: err.toString(),
        });
      }
      res.send({
        success: true,
        fileId: file.data.id,
        message: "File uploaded successfully to Google Drive.",
      });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
