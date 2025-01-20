const mqtt = require('mqtt');
const dotenv = require('dotenv');
dotenv.config();


const host = process.env.EMQX_BROKER_SERVICE_HOST;
const port = process.env.EMQX_PORT;
const username = process.env.EMQX_USER;
const password = process.env.EMQX_PASSWORD;

function MqttProvider() {
    this.client = mqtt.connect({
        host: host,
        port: Number(port),
        protocol: 'mqtt',
        username: username,
        password: password
    });

    this.client.on('connect', () => {
        console.log('Connected to MQTT broker');
    });

    this.client.on('error', (error) => {
        console.error('MQTT Connection Error:', error);
    });
}


MqttProvider.prototype.publishNewPlan2Patient = function (exerciseVideoUrl, comp_id) {
    const topic = 'exercise/url';
    const message = {
        url: exerciseVideoUrl,
        comp_id: comp_id
    };
    
    this.client.publish(topic, message, { qos: 2 }, (error) => {
        if (error) {
            console.error('Publish error:', error);
        } else {
            console.log(`New video link published to topic: ${topic}`);
        }
    });
};


module.exports = MqttProvider;

/**
         if (result) {
            mqtt.publishNewPlan2Patient(data.id_pac)
        }
 */