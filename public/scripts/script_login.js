const loginBtn = document.getElementById('loginBtn');


loginBtn.addEventListener('click', async function () {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const data = {
        username: username,
        password: password
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    const response = await fetch('/login', options);
    const apiResponse = await response.json();

    if (apiResponse.status == 'User logged in.') {
        window.open('http://localhost:3000/user_view', '_self');

    } else {
        alert(apiResponse.status);
    }

})