const router = require('express').Router()

const Contoller = require("./Controller")
const MqttProvider = require("../providers/MqttProvider");

const mqttProvider = new MqttProvider();
const controller = new Contoller(mqttProvider)




router.get('/', (req, res) => {
    res.send('Video upload service')
})


// IMPLEMENTADOS
router.post("/upload-video/companies/:user_id", (req, res) => {
    controller.uploadVideo(req, res)
})





module.exports = router