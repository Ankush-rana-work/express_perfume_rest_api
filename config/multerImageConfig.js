import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = './uploads/products';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        console.log(file);
        const filename = Date.now() + '-' + file.originalname;
        cb(null, filename)
    }
});

export const upload = multer({ storage: storage });

const category = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = './uploads/category';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        console.log(file);
        const filename = Date.now() + '-' + file.originalname;
        cb(null, filename)
    }
});

export const categoryUpload = multer({ storage: category });