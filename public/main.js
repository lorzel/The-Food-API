let btn = document.getElementById('btn');


function addToTable(column, rowNow) {
    let table = document.getElementById("result");
    let row = table.insertRow(rowNow);

    for (let i = 0; i < column.length; i++) {
        let cell = row.insertCell(i);
        cell.innerHTML = column[i];
    }

};

btn.addEventListener('click', async function () {
    let query = document.getElementById('userFood').value;
    console.log(query);

    const data = {
        query: query
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    const response = await fetch('/foodapi', options);
    const apiResponse = await response.json();
    console.log(apiResponse);

    console.log('number of items: ' + apiResponse.items.length);

    for (let i = 0; i < apiResponse.items.length; i++) {

        let infoArray = [];

        let element = apiResponse.items[i];
        let food_name = element.name;
        infoArray.push(food_name);
        let serving_size = element.serving_size_g;
        infoArray.push(serving_size);
        let calories = element.calories;
        infoArray.push(calories);
        let fat_total = element.fat_total_g;
        infoArray.push(fat_total);
        let fat_saturated = element.fat_saturated_g;
        infoArray.push(fat_saturated);
        let cholesterol = element.cholesterol_mg;
        infoArray.push(cholesterol);
        let sodium = element.sodium_mg;
        infoArray.push(sodium);
        let carbohydrates = element.carbohydrates_total_g;
        infoArray.push(carbohydrates);
        let fiber = element.fiber_g;
        infoArray.push(fiber);
        let sugar = element.sugar_g;
        infoArray.push(sugar);
        let potassium = element.potassium_mg;
        infoArray.push(potassium);
        let protein = element.protein_g;
        infoArray.push(protein);

        addToTable(infoArray, i);

        console.log(food_name);

        for (let key in apiResponse.items[i]) {
            console.log(`${key} : ${apiResponse.items[i][key]}`);


        }

    };
});

