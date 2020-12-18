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


function runSearch(element) {
    let searchTerm = "";
    if(element.parentNode.querySelector(".searchbar")) {
        searchTerm = element.parentNode.querySelector(".searchbar").value.trim();
        console.log("Searchbar exists. Term: " + searchTerm);
    }
    if (searchTerm != "") {
        let searchURL = `/search?q=${searchTerm}`;
        console.log(element.parentNode);
        location.href = searchURL;
    } 
    return false;
    // let mainContent = document.querySelector(".photo-grid");
    // let searchURL = `posts/search?q=${searchTerm}`;
    // fetch(searchURL)
    // .then((data) => {
    //     return data.json();
    // })
    // .then((data_json) => {
    //     let newMainContentHTML = '';
    //     mainContent.insertAdjacentHTML('afterbegin', `<p class="grid-info-text">${data_json.message}</p>`);
    //     data_json.results.forEach((row) => {
    //         newMainContentHTML += createCard(row);
    //     });
    //     console.log(newMainContentHTML);
    //     mainContent.innerHTML = newMainContentHTML;
    //     resizeImages();
    // })
    // .catch((err) => console.log(err));
    // return false;
}

// function createCard(postData) {
//     return `<div id="post-${postData.id}" class="photo-grid-item">
//     <div class="photo-grid-image-container">
//         <img src="${postData.thumbpath}" alt="" class="photo">
//     </div>
//     <p class="title">${postData.title}</p>
//     <a href="/posts/${postData.id}" class="post-link"></a> 
//     </div>`;
// }

// let currentNav = document.querySelector(".nav-header");

// function reflowHeader() {
//     console.log("run reflow");
//     if (window.innerWidth < 960) {
//         if (document.querySelector(".nav-header")) {
//             document.querySelector(".nav-header").querySelector("#header-links-browse").
//         }   
//     } else {
//         console.log(currentNav);
//     }
// }

// window.addEventListener('resize', reflowHeader);
// window.addEventListener('load', reflowHeader);

