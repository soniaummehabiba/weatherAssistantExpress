const express = require('express');
const router = express.Router();
const axios = require('axios');
const {WebhookClient} = require('dialogflow-fulfillment');

const openWeatherBaseUrl = 'api.openweathermap.org/data/2.5/weather?appid=d707e4d88986e6b6ad07bb5330416214';

router.get('/', (req, res, next) => {
    res.send(`Server is up and running.`);
});

router.post('/webhook', (req, res, next) => {

    const agent = new WebhookClient({request: req, response: res});

    // console.log('Dialogflow Request headers >> ' + JSON.stringify(req.headers));
    // console.log('Dialogflow Request body >> ' + JSON.stringify(req.body));

    let intentMap = new Map();

    intentMap.set('weather', weather);

    agent.handleRequest(intentMap);

    function weather(agent) {
        let params = agent.parameters;
        console.info(params);

        /*let queryParameters = ``;

        axios.get(openWeatherBaseUrl + '&' + queryParameters)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            })*/
        agent.add('ok wait')
    }
});

module.exports = router;
