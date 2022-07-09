const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const router = express.Router();
const bcrypt = require('bcrypt');

//connect to sqlite3 db
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database/db.sqlite", sqlite3.OPEN_READWRITE);
module.exports = db;

app.listen(3000, () => console.log('http://localhost:3000/'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(router);

//routes for different pages
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/register.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + ('/public/login.html')));
})


function apiCalls() {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM api_calls_count", (error, row) => {
            if (error) reject(error);
            resolve(row.global_api_calls_count);
        });
    });
}

let query = '';

app.post('/foodapi', async (request, response) => {

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

    const foodInfoResponse = await fetchApiData.json();
    response.json(foodInfoResponse);


    async function updateApiCallsCount() {
        let response = +(await apiCalls() + 1);
        console.log(response);
        db.run(`UPDATE api_calls_count SET global_api_calls_count = ${response}`, (error, row) => {
            if (error) {
                console.log(error.message);
            } else {
                console.log("entry updated");
            }
        })
    }

    updateApiCallsCount();

});


app.post('/register', (request, response) => {
    const { username, password } = request.body;
    bcrypt.hash(password, 10).then((hash) => {
        db.run(`INSERT INTO users (username, u_password) VALUES ('${username}', '${hash}')`, (error, row) => {
            if (error) {
                console.log(error.message);
                response.json({ status: error.message });
            } else {
                console.log("user added to db");
                response.json({ status: 'Registered succesfully' });
            }
        })
    })


})

app.post('/login', async (request, response) => {
    const { username, password } = request.body;

    let userCheck = await checkUserInDB(username, password);

    console.log(userCheck);

    if (userCheck == 'no such user') {
        response.json({ status: `No user ${username} found.` });
    }
    else if (userCheck == 'wrong password') {
        response.json({ status: 'Wrong password.'});
    } else {
        response.json({ status: 'Logged in properly.' })
    }

})


function checkUserInDB(db_username, db_password) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT USERNAME FROM users WHERE username = '${db_username}'`, (error, row) => {
            if (row) {
                db.get(`SELECT u_password FROM users WHERE username = '${db_username}' AND u_password = '${db_password}'`, (error, row) => {
                    if (row) {
                        resolve(row.u_password);
                    } else {
                        resolve('wrong password');
                    }
                })
            } else {
                resolve('no such user');
            }
        });
    });
}