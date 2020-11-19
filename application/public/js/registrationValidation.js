var usernameValid = false;
var emailValid = false;
var passwordValid = false;
var passwordSame = false;

function validateUsername(inputElement) {
    const beginWithAZ = /[A-Za-z]/g;
    const threePlusAlphaNum = /(.*[A-Za-z0-9]){3}/g;
    if (inputElement.parentNode.getElementsByClassName('error-msg').length != 0) {
        while (inputElement.parentNode.getElementsByClassName('error-msg')[0]) {
            inputElement.parentNode.getElementsByClassName('error-msg')[0].parentNode.removeChild(inputElement.parentNode.getElementsByClassName('error-msg')[0]);
        }
    }
    let test1 = beginWithAZ.test(inputElement.value.charAt(0));
    let test2 = threePlusAlphaNum.test(inputElement.value);
    usernameValid = test1 && test2;
    if (!test1) {
        inputElement.insertAdjacentHTML('beforebegin', 
        '<p class="error-msg">Username does not start with a letter.</p>'
        );
    }
    if (!test2) {
        inputElement.insertAdjacentHTML('beforebegin', 
        '<p class="error-msg">Username does not contain 3 or more alphanumeric characters.</p>'
        );
    }
    console.log("UsernameValid: " +  usernameValid);
}

function validateEmail(inputElement) {

}

function validatePassword(inputElement) {
    // const containUpper = /^(?=.*[A-Z])[A-Za-z\d/*\-+!@#$^]+$/g;
    // const containNum = /^(?=.*[\d])[A-Za-z\d/*\-+!@#$^]+$/g;
    // const containSpecial = /^(?=.*[/*\-+!@#$^])[A-Za-z\d/*\-+!@#$^]+$/g
    const containUpper = /[A-Z]+/g;
    const containNum = /\d+/g;
    const containSpecial = /[/*\-+!@#$^&]+/g
    if (inputElement.parentNode.getElementsByClassName('error-msg').length != 0) {
        while (inputElement.parentNode.getElementsByClassName('error-msg')[0]) {
            inputElement.parentNode.getElementsByClassName('error-msg')[0].parentNode.removeChild(inputElement.parentNode.getElementsByClassName('error-msg')[0]);
        }
    }
    let test1 = containUpper.test(inputElement.value);
    let test2 = containNum.test(inputElement.value);
    let test3 = containSpecial.test(inputElement.value);
    let test4 = (inputElement.value.length >= 8);
    passwordValid = test1 && test2 && test3 && test4;
    if (!test1) {
        inputElement.insertAdjacentHTML('beforebegin', 
        '<p class="error-msg">Password does not contain an uppercase letter.</p>'
        );
    }
    if (!test2) {
        inputElement.insertAdjacentHTML('beforebegin', 
        '<p class="error-msg">Password does not contain a number.</p>'
        );
    }
    if (!test3) {
        inputElement.insertAdjacentHTML('beforebegin', 
        '<p class="error-msg">Password does not contain one of the following special characters: / * - + ! @ # $ ^ &.</p>'
        );
    }
    if (!test4) {
        inputElement.insertAdjacentHTML('beforebegin', 
        '<p class="error-msg">Password needs to have 8 characters or more.</p>'
        );
    }
    console.log("PasswordValid: " +  passwordValid);

}

function inputValuesSame(inputElement, checkWithElement) {
    // console.log(inputElement.value + ", " + checkWithElement.value);
    // console.log(inputElement.value == checkWithElement.value);
    if (inputElement.parentNode.getElementsByClassName('error-msg').length != 0) {
        while (inputElement.parentNode.getElementsByClassName('error-msg')[0]) {
            inputElement.parentNode.getElementsByClassName('error-msg')[0].parentNode.removeChild(inputElement.parentNode.getElementsByClassName('error-msg')[0]);
        }
    }
    passwordSame = (inputElement.value == checkWithElement.value);
    console.log(passwordSame);
    if (!passwordSame) {
        inputElement.insertAdjacentHTML('beforebegin', 
        '<p class="error-msg">Passwords are not the same.</p>'
        );
    }
}

function checkAllValid() {
    if (usernameValid && passwordValid && passwordSame) {
        alert("All inputs are valid. Registration successful");
        location.reload();
        // return true;
    } else {
        let buttonClone = document.getElementById("register-button").cloneNode(true);
        document.getElementById("register-button").parentNode.replaceChild(buttonClone, document.getElementById("register-button"));
        document.getElementById("register-button").style.animation = "button-shake 0.75s ease-out";
        return false;
    }
}
