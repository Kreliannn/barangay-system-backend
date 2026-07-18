import path from 'path';
import multer from 'multer';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export const upload = multer({ storage });

// Multer middleware that accepts 3 ID image files: front, back, selfie
export const uploadIdImages = upload.fields([
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 },
  { name: 'idSelfie', maxCount: 1 },
]);

// Multer middleware for single profile picture upload
export const uploadProfilePicMiddleware = upload.single('profilePic');

// Multer middleware for business document uploads
export const uploadBusinessFiles = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'document', maxCount: 1 },
  { name: 'images', maxCount: 10 },
]);

// Multer middleware for adding images to an existing business
export const uploadBusinessImages = upload.fields([
  { name: 'images', maxCount: 10 },
]);

// Multer middleware for updating business logo
export const uploadBusinessLogo = upload.single('logo');

// Multer middleware for updating business document
export const uploadBusinessDocument = upload.single('document');
