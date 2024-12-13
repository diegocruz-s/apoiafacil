import { randomUUID } from "node:crypto";
import multer from 'multer';
import path from "node:path";

const configs = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, path.resolve(__dirname, '../uploads'));
  },
  filename(req, file, callback) {
    callback(null, randomUUID() + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: configs,
});

export {
  imageUpload,
};