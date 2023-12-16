import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/products')
    },
    filename: function (req, file, cb) {
        console.log(file);
        const filename = Date.now() + '-' + file.originalname;
        cb(null, filename)
    }
});

export const upload = multer({ storage: storage });