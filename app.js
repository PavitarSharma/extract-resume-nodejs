import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import PDFParser from "pdf2json";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const getPDFText = (data) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);
    pdfParser.on("pdfParser_dataError", reject);
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      resolve(pdfParser.getRawTextContent());

    });
    pdfParser.parseBuffer(data);
  });
};

app.post("/upload", async (req, res) => {
  try {
    let sampleFile = req.files.File;

    let text = await getPDFText(sampleFile.data);

    res.send(text);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.listen(PORT, () =>
  console.log(`Server started on http://loaclhost:${PORT}`)
);
