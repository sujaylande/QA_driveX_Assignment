const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fileRoutes = require("./routes/fileRoutes");
const qaRoutes = require("./routes/qaRoutes");
const cors = require("cors");
const Document = require("./models/Document")
const userRoutes = require("./routes/userRoutes")


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: "https://qa-1.onrender.com", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true,
}));

app.options('*', cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/qa", qaRoutes);



const connectDB = require("./config/database");
connectDB();

const fs = require("fs");
const { authenticateToken } = require("./middleware/auth");

const uploadsDir = "./server/uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

//ithe pn user id dya lagel ka?
app.get("/api/files/:documentId/history",authenticateToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await Document.findById(documentId, "queryHistory");
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json({ history: document.queryHistory });
  } catch (error) {
    console.error("Error fetching history:", error.message);
    res.status(500).json({ message: "Error fetching history", error: error.message });
  }
});

app.get("/api/files", authenticateToken, async (req, res) => {
  try {
    const documents = await Document.find({userId: req.user.userId}, "_id title");
    res.status(200).json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error.message);
    res.status(500).json({ message: "Error fetching documents" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
