let bmr = 0;
let bmr_btn = document.getElementById('bmr-btn');
let man = document.getElementById('man');
let woman = document.getElementById('woman');


bmr_btn.addEventListener('click', function () {

    let height = document.getElementById('height').value;
    let weight = document.getElementById('weight').value;
    let age = document.getElementById('age').value;

    if (man.checked) {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        document.getElementById('bmr-value').innerText = bmr;
    } else if (woman.checked) {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        document.getElementById('bmr-value').innerText = bmr;
    }
})