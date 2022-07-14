const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const router = express.Router();
const bcrypt = require('bcrypt');
const open = require('open');

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

router.get('/user_view', (rew, res) => {
    res.sendFile(path.join(__dirname + ('/public/user_view.html')));
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

    let userCheck = await userExist(username);
    let dbPassword = await checkPassword(username);

    if (userCheck == true) {
        bcrypt.compare(password, String(dbPassword)).then((match) => {
            if (match) {
                response.json({ status: 'User logged in.' });
            } else {
                response.json({ status: 'Wrong password' });
            }

        })
    }
    else if (userCheck == false) {
        response.json({ status: `no user "${username}" found` });
    } else {
        response.json({ status: userCheck })
    }

})

function userExist(db_username) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT USERNAME FROM users WHERE username = '${db_username}'`, (error, row) => {
            if (row) {
                resolve(true);
            } else if (error) {
                resolve(error.message);
            } else {
                resolve(false);
            }
        })
    })
}

function checkPassword(db_username) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT u_password FROM USERS WHERE username = '${db_username}'`, (error, row) => {
            if (row) {
                console.log(row.u_password);
                resolve(row.u_password);
            }
            else if (error) {
                resolve(error.message);
            }
            else {
                resolve(false);
            }
        })
    })
}