const express = require("express");
const axios = require("axios");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const app = express();
const port = 3000;

// API Key
const apiKey = "67cfab417da8f707b41d72efb0dc4b24"; // আপনার API কী

// Multer configuration for file uploads
const upload = multer({ dest: "uploads/" });

// Upload route to handle image uploads
app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No image file uploaded.");
  }

  const filePath = path.join(__dirname, req.file.path);

  try {
    // Convert file to base64
    const base64Image = fs.readFileSync(filePath, { encoding: "base64" });

    // Prepare form data
    const formData = new FormData();
    formData.append("image", base64Image);

    // Send request to imgbb API
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      formData,
      { headers: formData.getHeaders() }
    );

    // Delete the uploaded file after sending to the API
    fs.unlinkSync(filePath);

    // Send back the uploaded image URL
    res.status(200).send({
      success: true,
      imageUrl: response.data.data.url,
      deleteUrl: response.data.data.delete_url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).send("Failed to upload image. Please try again.");
  }
});

// Base route to check server status
app.get("/", (req, res) => {
  res.send("Welcome to SiamTheFrog's Image Upload API!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
