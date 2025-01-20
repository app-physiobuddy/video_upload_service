const mqtt = require('mqtt');
const dotenv = require('dotenv');
dotenv.config();


const host = process.env.EMQX_BROKER_SERVICE_HOST;
const port = process.env.EMQX_PORT;
const username = process.env.EMQX_USER;
const password = process.env.EMQX_PASSWORD;


class MqttProvider {
    constructor() {
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
    };

    publishNewExercise(exercise) {
        console.log("HERE", exercise)

        const topic = 'newexercise';
    
        this.client.publish(topic, exercise, { qos: 2 }, (error) => {
            if (error) {
                console.error('Publish error:', error);
            } else {
                console.log(`New video link published to topic: ${topic}`);
            }
        });
    };
}




module.exports = MqttProvider;

