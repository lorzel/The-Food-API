const regBtn = document.getElementById('regBtn');
let usernameField = document.getElementById('form-username');
let passwordField = document.getElementById('form-password');


regBtn.addEventListener('click', async function () {
    let username = document.getElementById('form-username').value;
    let password = document.getElementById('form-password').value;

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

    const response = await fetch('/register', options);
    const apiResponse = await response.json();

    alert(apiResponse.status);


})

usernameField.addEventListener('change', function () {
    if (this.value.length < 3) {
        alert('Username must have at leat 63 characters');
    }
})

passwordField.addEventListener('change', function () {
    if (this.value.length < 8) {
        alert('Password must be at least 8 characters long');
        regBtn.disabled = true;
    } else {
        regBtn.disabled = false;
    }
})