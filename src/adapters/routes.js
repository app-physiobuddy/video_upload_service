const router = require('express').Router()

const Contoller = require("./Controller")
const MqttProvider = require("../providers/MqttProvider");

const mqttProvider = new MqttProvider();
const controller = new Contoller(mqttProvider)




router.get('/', (req, res) => {
    res.send('Video upload service')
})


// IMPLEMENTADOS
router.post("/therapists/:therapist_user_id/companies/:company_entity_id/exercises", (req, res) => {

    controller.uploadVideo(req, res)
})

 router.get('/videos/:comp_id', (req, res) => {
    controller.listFiles(req, res)
  });

  router.get('/videos/:comp_id/:filename', (req, res) => {
    controller.serveVideo(req, res)
  });




module.exports = router