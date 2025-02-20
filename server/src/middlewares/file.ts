import path from "path";
import multer from "multer";
import { randomUUID } from "crypto";

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};

const storageAvatar = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/avatar"));
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id || "unknown";
    const newFileName = `${userId}${path.extname(file.originalname)}`;
    req.fileName = newFileName;
    cb(null, newFileName);
  },
});

export const uploadAvatar = multer({
  storage: storageAvatar,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
}).single("avatar");

const storageQuizz = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/quizz"));
  },
  filename: (req, file, cb) => {
    const quizzId = req.params.quizz_id || randomUUID();
    const newFileName = `${quizzId}${path.extname(file.originalname)}`;
    req.fileName = newFileName;
    cb(null, newFileName);
  },
});

export const uploadQuizz = multer({
  storage: storageQuizz,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
}).single("quizz");
