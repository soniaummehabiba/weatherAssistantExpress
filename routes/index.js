const express = require('express');
const router = express.Router();
const axios = require('axios');
const {WebhookClient} = require('dialogflow-fulfillment');

const openWeatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather?appid=d707e4d88986e6b6ad07bb5330416214';

router.get('/', (req, res, next) => {
    res.send(`Server is up and running.`);
});

router.post('/webhook', (req, res, next) => {

    const agent = new WebhookClient({request: req, response: res});

    // console.log('Dialogflow Request headers >> ' + JSON.stringify(req.headers));
    // console.log('Dialogflow Request body >> ' + JSON.stringify(req.body));

    let intentMap = new Map();

    intentMap.set('weather', weather);
    intentMap.set('weather - context:weather - comment:condition', condition);
    intentMap.set('weather.condition', weatherWithCondition);

    agent.handleRequest(intentMap);

    function weather(agent) {
        let params = agent.parameters;
        console.info('params ', params);

        let queryParameters = `q=${params.address.city ? params.address.city : params.address.country}`;
        console.info('queryParameters ', queryParameters);

        let requestURL = openWeatherBaseUrl + '&' + queryParameters + '&units=metric';
        console.info('requestURL ', requestURL);

        return axios
            .get(requestURL)
            .then(res => {
                let {name, main} = res.data;
                return agent.add(`The temperature of ${name} is ${main.temp}'C and humidity is ${main.humidity}%`)
            })
            .catch(err => {
                console.log(`error in getting details: ${err}`);
                return agent.add(`error in getting details: ${err}`)
            });
    }

    function condition(agent) {
        let params = agent.parameters;
        console.info('params ', params);

        let contexts = agent.contexts[0].parameters;
        let queryParameters = `q=${contexts.address.city ? contexts.address.city : contexts.address.country}`;
        console.info('queryParameters ', queryParameters);

        let requestURL = openWeatherBaseUrl + '&' + queryParameters + '&units=metric';
        console.info('requestURL ', requestURL);

        return axios
            .get(requestURL)
            .then(res => {
                let {name, weather} = res.data;
                return agent.add(`Its ${weather[0].main} (${weather[0].description}) in ${contexts.address.city ? contexts.address.city : contexts.address.country}`)
            })
            .catch(err => {
                console.log(`error in getting details: ${err}`);
                return agent.add(`error in getting details: ${err}`)
            });
    }

    function weatherWithCondition(agent) {
        let params = agent.parameters;
        console.info('params ', params);

        let queryParameters = `q=${params.address.city ? params.address.city : params.address.country}`;
        console.info('queryParameters ', queryParameters);

        let requestURL = openWeatherBaseUrl + '&' + queryParameters + '&units=metric';
        console.info('requestURL ', requestURL);

        return axios
            .get(requestURL)
            .then(res => {
                let {name, weather} = res.data;
                return agent.add(`Its ${weather[0].main} (${weather[0].description}) in ${params.address.city ? params.address.city : params.address.country}`)
            })
            .catch(err => {
                console.log(`error in getting details: ${err}`);
                return agent.add(`error in getting details: ${err}`)
            });
    }
});

module.exports = router;
