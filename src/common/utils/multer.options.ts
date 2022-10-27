import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// Create_Folder
const createFolder = (files: string) => {
  // Upload
  try {
    fs.mkdirSync(path.join(__dirname, '..', `uploads`));
  } catch (error) {
    console.log(error);
  }
  // Upload/files
  try {
    fs.mkdirSync(path.join(__dirname, '..', `uploads/${files}`));
  } catch (error) {
    console.log(error);
  }
};

// Save_Files
const storage = (files: string): multer.StorageEngine => {
  createFolder(files);

  return multer.diskStorage({
    // 파일 저장 위치
    destination(req, file, cb) {
      const folderName = path.join(__dirname, '..', `uploads/${files}`);
      cb(null, folderName);
    },

    // 파일 이름
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      const fileName = `${path.basename(
        file.originalname,
        ext,
      )}${Date.now()}${ext}`;
      cb(null, fileName);
    },
  });
};

export const multerOptions = (files: string) => {
  const result: MulterOptions = {
    storage: storage(files),
  };
  return result;
};
