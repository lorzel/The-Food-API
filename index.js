const express = require('express');
//const { request } = require('http');
const app = express();
require('dotenv').config();

app.listen(3000, () => console.log('http://localhost:3000/'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

let query = '';

app.post('/foodapi', async (request, response) => {
    console.log(request.body);
    for (key in request.body) {
        query = request.body[key];
    }


    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY,
            'X-RapidAPI-Host': 'calorieninjas.p.rapidapi.com'
        }
    };

    const fetchApiData = await fetch(`https://calorieninjas.p.rapidapi.com/v1/nutrition?query=${query}`, options)
    //.then(response => response.json())
    //.then(response => console.log(response))
    //.catch(err => console.error(err));

    const foodInfoResponse = await fetchApiData.json();
    response.json(foodInfoResponse);
});