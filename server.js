const express = require("express");
const multer = require("multer");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(
  cors({
    origin: "*", // Or use '*' to allow all origins
  })
);
// Set up file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload = multer({ storage: storage });

// Routes
app.post("/upload", upload.single("image"), (req, res) => {
  // You can perform actions with the uploaded file here
  res.json({ message: "File upload successful" });
});
app.get("/status", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
    timestamp: new Date(),
  });
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
