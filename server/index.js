const express = require("express");
const multer = require("multer");
const docxtopdf = require("docx-pdf");
const path = require("path");
const cors = require("cors");



const app = express();
const port = 3000;

app.use(cors());

// muters for   testing //////////////////////////////////
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/convertFile", upload.single("file"), (req, res, next) => {
  try {
    if (!req.file) {
        return res.status(400).json({ 
        message:"no file uploaded"});
    }

    // output path
    let outputPath = path.join(__dirname,"files",`${req.file.originalname}.pdf`);

    docxtopdf(req.file.path, outputPath, (err, result)=> {
      if (err) {
        console.log(err);
        return res.status(500).json({ 
        message: "Error while converting DOCX to PDF" });

      }
      res.download(outputPath, ()=> {
        console.log("file was successfully uploaded"); })
    
    });
  } catch (error) {
    res.status(500).send({ message: "internal server error" });
    console.error(error.message);
    // Add your code here to handle the error
    // For example, log the error to a file or database
  }
});

///////////////////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`Port on  listening on port 💅 ${port}`);
});
