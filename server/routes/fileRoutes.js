const express = require("express");
const { uploadFile, extractText, uploadFiles, uploadDriveLink } = require("../controllers/fileController");
const multer = require("multer");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post("/upload",authenticateToken, upload.array("files", 5), uploadFiles);
router.post("/upload-drive-link",authenticateToken, uploadDriveLink);



module.exports = router;
