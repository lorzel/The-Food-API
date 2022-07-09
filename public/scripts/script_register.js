const regBtn = document.getElementById('regBtn');


regBtn.addEventListener('click', async function () {
    const username = document.getElementById('form-username').value;
    const password = document.getElementById('form-password').value;

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