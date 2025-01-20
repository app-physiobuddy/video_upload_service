require("dotenv").config();
const multer = require("multer");
const ErrorTypes = require("../utils/errors/ErrorTypes");
const path = require("path");
const fs   = require("fs");

class Controller {

    constructor(mqttProvider) {
        this.mqttProvider = mqttProvider
    }
    async uploadVideo(req, res) {
        const id_comp = Number(req.params.company_entity_id)
        const therapist_user_id = Number(req.params.therapist_user_id)
        //if (!id_comp) throw ErrorTypes.UnauthorizedAcess("user_id is required");
        //if (!req.body.data) throw ErrorTypes.UnauthorizedAcess("data is required");

        //const data = JSON.parse(req.body.data); // Parse the JSON data


/**
 *        
        }
 */


        const upload = multer({
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    const FOLDERPATH = path.join(__dirname, "../../videos", String(id_comp));
                    let currentDate = Date.now();
                    file.filename = `${currentDate+file.originalname}`
                    console.log(file.filename)
                    
                    // Ensure the directory exists
                    require('fs').mkdirSync(FOLDERPATH, { recursive: true });
                    
                    cb(null, FOLDERPATH);
                },
                filename: (req, file, cb) => {
                    //const extension = path.extname(file.originalname);
                    //const newFilename = `${id_comp}${extension}`;
                    cb(null, file.filename);
                }
            }),
        }).single('video');

        upload(req, res, (err) => {
            if (err) {
                console.error("Error uploading video:", err);
                return res.status(500).json({ message: "Error uploading video" });
            }
            if (!req.body.data) throw ErrorTypes.UnauthorizedAcess("data is required");
            if (!req.file) {
                return res.status(400).json(ErrorTypes.NotFoundError("video is required"));
            }
            const reqData = JSON.parse(req.body.data); 
            const data = {
                name : reqData.name,
                desc : reqData.desc,
                obs: reqData.obs,
                video_dir : "",
                id_category : Number(reqData.id_category),
                id_company : Number(id_comp), 
                id_created_by : Number(therapist_user_id),
                date_updated : new Date(),
            }

        

            try {
                const fileUrl = `${req.protocol}://${req.get('host')}/videos/${String(id_comp)}/${req.file.filename}`;
                const url2 = `${String(id_comp)}/${req.file.filename}`
                console.log(fileUrl);
                data.video_dir = fileUrl
                this.mqttProvider.publishNewExercise(JSON.stringify(data));


                res.status(200).json(data);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }

    async listFiles(req, res)  {
        const compId = req.params.comp_id;
        const folderPath = path.join(__dirname, '../../videos', compId);
        console.log(folderPath)
    
        // Check if the folder exists
        if (!fs.existsSync(folderPath)) {
            return res.status(404).json({ error: 'Folder not found' });
        }
    
        // Read files in the folder
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                console.error('Error reading folder:', err);
                return res.status(500).json({ error: 'Unable to read folder' });
            }
    
            // Return list of files as a response
            const fileUrls = files.map(file => ({
                name: file,
                url: `${req.protocol}://${req.get('host')}/videos/${compId}/${file}`,
            }));
    
            res.json({ files: fileUrls });
        });
    }

    async serveVideo(req, res){
        const { comp_id, filename } = req.params;
        const filePath = path.join(__dirname, '../../videos', comp_id, filename);
    
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Video not found' });
        }
    
        res.sendFile(filePath);
    }
    
}

module.exports = Controller;