const router = require('express').Router()

const Contoller = require("./Controller")
const controller = new Contoller()




router.get('/', (req, res) => {
    res.send('Video upload service')
})


// IMPLEMENTADOS
router.post("/upload-video/companies/:user_id", (req, res) => {
    controller.uploadVideo(req, res)
})





module.exports = router