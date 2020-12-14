function closeFlash(element) {
    element.parentNode.parentNode.classList.add('flash-container-closed');
    setTimeout(function() {
        element.parentNode.parentNode.parentNode.remove();
    }, 250);
}

let flashList = document.getElementsByClassName('auto-dismiss');

for (i = 0; i < flashList.length; i++) {
    element = flashList[i];
    // console.log(element);
    setTimeout(function() {
        element.parentNode.classList.add('flash-container-closed');
        setTimeout(function() {
            element.parentNode.parentNode.remove();
        }, 250);
    }, 5000);
}




