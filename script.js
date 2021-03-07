// TODO: start using prices from json. See this: https://stackoverflow.com/a/24378510
// var mydata = JSON.parse(data);

let valuePriceInput = document.getElementById('valuePriceInput');
valuePriceInput.addEventListener('input', calculateValuePrice);
valuePriceInput.addEventListener("keyup", closeSoftKeyboardWhenEnterPressed);

document.getElementById('seasonDaysSelection').addEventListener("change", calculateSeasonPrice);
document.getElementById('zoneSelection').addEventListener("change", calculateSeasonPrice);
document.getElementById('customerGroupSelection').addEventListener("change", calculateSeasonPrice);

function closeSoftKeyboardWhenEnterPressed(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.activeElement.blur();
    }
}

function calculateValuePrice() {
    let price = 0;
    let price1 = 0;
    let price2 = 0;
    let price3 = 0;
    let price4 = 0;

    let priceInputElement = document.querySelector('#valuePriceInput');
    price = priceInputElement.value;

    if (price >= 0.01) {
        price1 = (parseFloat(price, 10));
        price2 = (parseFloat(price, 10) + 1);
        price3 = (parseFloat(price, 10) + 1);
        price4 = (parseFloat(price, 10) + 1);
    } else {
        // alle 0.01
    }

    let priceElement1 = document.querySelector('#valueCost1');
    priceElement1.textContent = price1.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' });

    let priceElement2 = document.querySelector('#valueCost2');
    priceElement2.textContent = price2.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' });

    let priceElement3 = document.querySelector('#valueCost3');
    priceElement3.textContent = price3.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' });

    let priceElement4 = document.querySelector('#valueCost4');
    priceElement4.textContent = price4.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' });
}

function calculateSeasonPrice() {
    let price1 = 0;
    let prices = [0, 0, 0];

    let priceArray = [0.0, 0.0, 0.0, 0.0, 0.0];

    let adult = [0.0, 0.0, 0.0, 0.0, 0.0];
    let discount = [0.0, 0.0, 0.0, 0.0, 0.0];
    let student = [0.0, 0.0, 0.0, 0.0, 0.0];

    // AB = BC = D:
    let adultAB = [47.1, 62.7, 125.4, 188.1, 627.3];
    let discountAB = [23.6, 31.4, 62.8, 94.2, 314.0];
    let studentAB = [25.9, 34.5, 69.0, 103.5, 344.7];

    // ABC = BCD:
    let adultABC = [74.8, 99.7, 199.4, 299.1, 997.3];
    let discountABC = [37.5, 49.9, 99.8, 149.7, 498.7];
    let studentABC = [41.1, 54.8, 109.6, 164.4, 548.0];

    // CD:
    let adultCD = [60.5, 80.6, 161.2, 241.8, 806.3];
    let discountCD = [30.3, 40.3, 80.6, 120.9, 403.3];
    let studentCD = [33.3, 44.3, 88.6, 132.9, 443.6];

    // ABCD:
    let adultABCD = [107.2, 142.7, 285.4, 428.1, 1427.3];
    let discountABCD = [53.8, 71.4, 142.8, 214.2, 713.7];
    let studentABCD = [59.0, 78.5, 157.0, 235.5, 785.6];

    //let days = 0;

    let selectedSeasonDays = "";

    let selectedZone = "";

    let selectedCustomerGroup = "";

    let seasonDaysSelection = document.querySelector('#seasonDaysSelection');
    selectedSeasonDays = seasonDaysSelection.value;

    let zoneSelection = document.querySelector('#zoneSelection');
    selectedZone = zoneSelection.value;

    let customerGroupSelection = document.querySelector('#customerGroupSelection');
    selectedCustomerGroup = customerGroupSelection.value;

    // Hinnat valitun vyöhykkeen perusteella:
    if (selectedZone == "ab" || selectedZone == "bc" || selectedZone == "d") {
        adult = adultAB;
        discount = discountAB;
        student = studentAB;
    } else if (selectedZone == "abc" || selectedZone == "bcd") {
        adult = adultABC;
        discount = discountABC;
        student = studentABC;
    } else if (selectedZone == "cd") {
        adult = adultCD;
        discount = discountCD;
        student = studentCD;
    } else if (selectedZone == "abcd") {
        adult = adultABCD;
        discount = discountABCD;
        student = studentABCD;
    }

    let customerGroup = -1;

    if (selectedCustomerGroup == "adult") {
        priceArray = adult;
        customerGroup = 0;
    } else if (selectedCustomerGroup == "child" || selectedCustomerGroup == "pensioner" || selectedCustomerGroup == "physicallyChallenged") {
        priceArray = discount;
        customerGroup = 1;
    } else if (selectedCustomerGroup == "student") {
        priceArray = student;
        customerGroup = 2;
    }

    if (selectedSeasonDays == "14") {
        price1 = priceArray[0];
    } else if (selectedSeasonDays == "30") {
        price1 = priceArray[1];
    } else if (selectedSeasonDays == "60") {
        price1 = priceArray[2];
    } else if (selectedSeasonDays == "90") {
        price1 = priceArray[3];
    } else if (selectedSeasonDays == "360") {
        price1 = priceArray[4];
    }

    if (selectedSeasonDays != "empty"){
        prices = calculateSeasonStorePrices(price1, customerGroup);
    }

    let priceElement1 = document.querySelector('#seasonCost1');
    priceElement1.textContent = price1.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' });

    let priceElement2 = document.querySelector('#seasonCost2');
    priceElement2.textContent = prices[0].toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' });

    let priceElement3 = document.querySelector('#seasonCost3');
    priceElement3.textContent = prices[1].toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' });

    let priceElement4 = document.querySelector('#seasonCost4');
    priceElement4.textContent = prices[2].toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' });
}

function calculateSeasonStorePrices(price, customerGroup) {
    
    let rKioskiPrice = price * 0.035;

    // R-kioski: percent 3,5%, max. 5 euros
    if (rKioskiPrice > 5.00) {
        rKioskiPrice = price + 5.00;
    } else {
        rKioskiPrice = price * 1.035;
    }

    // student or discount group: different price in K-ryhmä (1 euro)
    if (customerGroup == 1 || customerGroup == 2) { 
        return [price + 1, price + 1, rKioskiPrice];
    }
    // adult: different price in K-ryhmä (2 euros)
    return [price + 1, price + 2, rKioskiPrice];
}

$(document).ready(function () {
    $('[data-toggle="popover"]').popover({ html: true });
    $(".nav-tabs a").click(function () {
        $(this).tab('show');
    });
    $("#linkToCalc1").click(function (event) {
        $('.tab2').tab('show');
    });
    $("#linkToCalc2").click(function (event) {
        $('.tab3').tab('show');
    });
});
