// var photoCount = 0;

// function fadeOut(element){
//     element.classList.add('fade-out');
//     setTimeout(function() {
//         element.parentNode.removeChild(element);
//         photoCount--;
//         document.querySelector('.grid-info-text').innerHTML= "There are " + photoCount + " photo(s) being shown";
//     }, 500);
// }

// function createPhotoCard(data, containerDiv){
//     let photoContainer = '<div class="photo-grid-item" onclick="fadeOut(this);"><img src="' + data.url + '" alt="" class="photo"><p class="title">' + data.title + '</p></div>'
//     containerDiv.insertAdjacentHTML('beforeend', photoContainer);
// }

// let mainDiv = document.querySelector(".photo-grid");

// if (mainDiv){
//     let fetchURL = "https://jsonplaceholder.typicode.com/albums/2/photos"
//     fetch(fetchURL)
//     .then((data) => data.json())
//     .then((photos) => {
//         let innerHTML = "";
//         photos.forEach((photo) => {
//             createPhotoCard(photo, mainDiv);    
//         });
//         photoCount = photos.length;
//         document.querySelector('.grid-info-text').innerHTML = "There are " + photoCount + " photo(s) being shown";
//     })
// }

function resizeImages() {
    let imageContainers = document.getElementsByClassName('photo-grid-image-container');

    for (i = 0; i < imageContainers.length; i++) {
        let containerWidth = window.getComputedStyle(imageContainers[i].parentNode).getPropertyValue("width");
        console.log(containerWidth);
        imageContainers[i].style.height = containerWidth;
    }
}

window.onload = resizeImages;
window.onresize = resizeImages;