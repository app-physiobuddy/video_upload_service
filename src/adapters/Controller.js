require("dotenv").config();
const multer = require("multer");
const ErrorTypes = require("../utils/errors/ErrorTypes");
const path = require("path");
const  mqtt = require("../providers/MqttProvider");

class Controller {
    async uploadVideo(req, res) {
        const { user_id } = req.params;

        
        if (!user_id) {
            return res.status(401).json(ErrorTypes.UnauthorizedAcess("user.id is required"));
        }

        const upload = multer({
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    const FOLDERPATH = path.join(__dirname, "../../videos", user_id);
                    let currentDate = Date.now();
                    file.filename = `${currentDate+file.originalname}`
                    console.log(file.filename)
                    
                    // Ensure the directory exists
                    require('fs').mkdirSync(FOLDERPATH, { recursive: true });
                    
                    cb(null, FOLDERPATH);
                },
                filename: (req, file, cb) => {
                    //const extension = path.extname(file.originalname);
                    //const newFilename = `${user_id}${extension}`;
                    cb(null, file.filename);
                }
            }),
        }).single('video');

        upload(req, res, (err) => {
            if (err) {
                console.error("Error uploading video:", err);
                return res.status(500).json({ message: "Error uploading video" });
            }

            if (!req.file) {
                return res.status(400).json(ErrorTypes.NotFoundError("video is required"));
            }

            try {
                const fileUrl = `${req.protocol}://${req.get('host')}/videos/${user_id}/${req.file.filename}`;
                const url2 = `${user_id}/${req.file.filename}`
                console.log(fileUrl);
                mqtt.publishNewPlan2Patient(fileUrl, user_id);

                res.status(200).json({ url: url2, user_id });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
}

module.exports = Controller;