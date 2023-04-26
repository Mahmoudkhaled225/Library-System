import multer from "multer";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import fs from "fs";
export const validationObject = {
    image: ["image/png", "image/jpeg"],
};
export const myMulter = ({
                             customPath = "general",
                             customValidation = validationObject.image
                         } = {}) => {
    const fullPath = path.join(__dirname, `../uploads/${customPath}`);
    console.log(fullPath);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, fullPath);
        },
        filename: (req, file, cb) => {
            const uniqueName = nanoid(5) + "__" + file.originalname;
            cb(null, uniqueName);
        }
    });
    const fileFilter = (req, file, cb) => {
        if (customValidation.includes(file.mimetype)) {
            return cb(null, true);
        }
        cb(new Error("in-valid extension", { cause: 400 }), false);
    };
    const upload = multer({ fileFilter, storage });
    return upload;
};

