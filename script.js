const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck= document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector(".generateButton");
const allcheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "*/+)()></$#%@&''";

let password ="";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator('#ccc');

//set password lenght
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength
    
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundsize = ((passwordLength - min)*100/(max - min)) + "% 100%"

}


function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxshadow =`0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function getRandomNumber() {
    return getRandomInteger(0,9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateupperCase() {
    return String.fromCharCode(getRandomInteger(65,91));

}

function generateSymbol () {
    const random = getRandomInteger(0,symbols.length);
    return symbols.charAt(random);
}


function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked)hasUpper = true;
    if(lowercaseCheck.checked)hasLower = true;
    if(numbersCheck.checked)hasNum = true;
    if(symbolsCheck.checked)hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) && 
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");

    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {

    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e)  {
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");

    setTimeout (() => {
        copyMsg.classList.remove("active");
    },2000);
    
}

function shufflePassword (array) {
    //fisher yates method 
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const terp = array[i];
        array[i] = array[j];
        array[j]= terp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}



function handlecheckBoxChange(){
    checkCount = 0;
    allcheckBox.forEach((checkbox) => {
        if(checkbox.checked)
        checkCount ++;
    });

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider(); 
    }
}

allcheckBox.forEach ((checkbox) => {
    checkbox.addEventListener('click',handlecheckBoxChange);
})

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();

})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
    copyContent();
})

generateButton.addEventListener('click', () => {
    //none of the checkbox are selected
    if(checkCount == 0) return;

    if(password < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //let's find the new password
    console.log("starting the journey");
    //remove old password
    password = "";


    //lets put the stuffed by checkboxes

    // if(uppercaseCheck.checked) {
    //     password <= generateUpperCase();
    // }

    
    // if(lowercaseCheck.checked) {
    //     password <= generatLowerCase();
    // }


    
    // if(numbersCheck.checked) {
    //     password <= generateRandomNumber();
    // }


    
    // if(symbolsCheck.checked) {
    //     password <= generateSymbol();
    // }


    let functionArr = [];

    if(uppercaseCheck.checked)
         functionArr.push(generateupperCase);

    if(lowercaseCheck.checked)
         functionArr.push(generateLowerCase);

    
    if(numbersCheck.checked)
         functionArr.push(getRandomNumber);

    if(symbolsCheck.checked)
         functionArr.push(generateSymbol);

    //compulsory addition
    
    for (let i=0; i  < functionArr.length; i++) {
        password += functionArr[i]();
    }
    console.log("Compulsory addition done");

    //remaining addition 
    for(let i=0; i<passwordLength-functionArr.length; i++) {
        let randIndex = getRandomInteger(0,functionArr.length);
        console.log("randIndex" + randIndex);
        password += functionArr[randIndex]();
    }
    console.log("remaning addition done");

    //shuffle the password
    password = shufflePassword( Array.from(password));
    console.log("shuffling done")

    //show in ui
    passwordDisplay.value = password;
    console.log("ui done");

    //calculaten strength
    calcStrength();


    
}); 