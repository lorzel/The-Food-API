let btn = document.getElementById('btn');
let classesList = ["name", "size", "calor", "t_fat", "s_fat", "choler", "sod", "carb", "fib", "sug", "pot", "prot"];
let totalTable = document.getElementById("total-row");


function addToTable(column, rowNow) {
    let table = document.getElementById("result");
    let row = table.insertRow(rowNow);
    let total = 0;
    let totalArray = [];

    //insert to table value for each column
    for (let i = 0; i < column.length; i++) {
        let cell = row.insertCell(i);
        cell.innerHTML = column[i];
        cell.classList.add(classesList[i]);
    }

    //insert row with Total amounts
    let rowsNumber = table.rows.length;
    let totalRow = table.insertRow(rowsNumber);

    for (let i = 1; i < classesList.length; i++) {
        document.querySelectorAll("." + classesList[i]).forEach(function (element, index) {
            total += +element.textContent;
        });
        totalArray.push(total);
        total = 0;
    };

    //insert total sum values into 'Total' row
    for (let i = 1; i <= 11; i++) {
        totalTable.rows[0].cells[i].innerHTML = totalArray[i - 1];
    }

    //clear array with total values afert function execute
    totalArray = [];

};

btn.addEventListener('click', async function () {

    let query = document.getElementById('user-food').value;

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

        document.getElementById("table").style.display = "block";


    };
});

