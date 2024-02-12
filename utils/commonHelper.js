import config from '../config/index.js';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CommonHelper = {
    sendError: (res, statusCode, message) => {
        res.status(statusCode).json({ message });
    },
    sendSucess: (res, statusCode, message, data) => {
        res.status(statusCode).json({
            message,
            data
        });
    },
    generateHash: (password) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Hash the password
                const salt = await bcrypt.genSalt(config.HASH_SALT);
                const hashedPassword = await bcrypt.hash(password, salt);
                resolve(hashedPassword);
            } catch (error) {
                reject(error);
            }
        })

    },
    hashCompare: (password, hashedPassword) => {
        return new Promise(async (resolve, reject) => {
            try {
                const isValid = await bcrypt.compare(password, hashedPassword);
                resolve(isValid);
            } catch (error) {
                reject(error);
            }
        })
    },
    MoveFileToUploadFolder: (file, folder_name) => {
        return new Promise(async (resolve, reject) => {
            const fileName = (new Date()).getTime() + '_' + file.name;
            const uploadPath = __dirname + `/../uploads/${folder_name}/` + fileName;
            const imagePath = `uploads/${folder_name}/` + fileName;
            // Use the mv() method to place the file somewhere on your server
            file.mv(uploadPath, (err) => {
                if (err) {
                    reject({ status: false, path: imagePath, name: fileName });
                }

                resolve({ status: true, path: imagePath, name: fileName });
            });
        });
    },
    getFileType: (mimetype) => {
        if (mimetype == "image/gif") {
            return 'image';
        } else if (mimetype == "image/jpeg") {
            return 'image';
        } else if (mimetype == "image/png") {
            return 'image';
        } else if (mimetype == "video/mpeg") {
            return 'video';
        } else if (mimetype == "video/mp4") {
            return 'video';
        } else if (mimetype == "image/webp") {
            return 'image';
        }
    },
    generateTimestamp: () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}-${hours}${minutes}${seconds}`;
    }

}

export default CommonHelper;