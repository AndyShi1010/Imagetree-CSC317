let postTimes = document.querySelector(".post-timestamp");
postTimes.textContent = timestampLocalizer(postTimes.textContent);

let commentTimes = document.querySelectorAll(".comment-timestamp");
commentTimes.forEach((data) => {
    data.textContent = timestampLocalizer(data.textContent);
})

function timestampLocalizer(date) {
    let newDate = new Date(date);
    return newDate.toLocaleDateString("en-US") + " at " + newDate.toLocaleTimeString("en-US");
}

function updateCommentSubmit(text) {
    let button = document.getElementById("send-comment-button");
    if(text && text.trim() !== "") {
        button.removeAttribute("disabled");
    } else {
        button.setAttribute("disabled", true);
    }
}

function postComment(element) {
    let commentText = element.parentNode.querySelector("#comment-field").value;
    while (document.getElementsByClassName('add-comment-error')[0]) {
        document.getElementsByClassName('add-comment-error')[0].parentNode.removeChild(document.getElementsByClassName('add-comment-error')[0]);
    }
    let postId = document.location.pathname.split("/")[2].match(/\d+/g).map(Number)[0];
    
    if(!commentText || commentText.trim() == "") {
        return;
    }

    let createFetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify({
            comment: commentText,
            postId: postId
        })
    }

    fetch('/comments/create', createFetchOptions)
    .then((response) => response.json())
    .then((data) => {
        if (data.status != "success") {
            document.querySelector("#add-comment").insertAdjacentHTML('beforeend', '<p class="add-comment-error">Comment could not be sent.</p>');
        } else {
            fetch(`/comments/getComments/${postId}`)
            .then((response) => response.json())
            .then((results) => {
            console.log("Results:" + results[0]);
            insertComment(results[0]);
            })
        }
    })
    .catch(err => console.log(err));
    element.parentNode.querySelector("#comment-field").value = "";
    document.getElementById("send-comment-button").setAttribute("disabled", true);
}

function insertComment(data) {
    console.log(data.created);
    document.querySelector("#comments-container").insertAdjacentHTML('afterbegin', `<div class="comment-card-container hidden" id="comment-card-container-${data.id}">
    <div id="post-${data.id}" class="comment-card">
    <div class="comment-card-creation-data">
        <div class="comment-card-author">
            <img src="/${data.userphoto}" alt="" class="userphoto">
            <h3>${data.username}</h3>
        </div>
        <p class="comment-timestamp">${timestampLocalizer(data.created)}</p>
    </div>
    <p>${data.comment}</p>
    </div></div>`);
    setTimeout(function() {
        document.getElementById(`comment-card-container-${data.id}`).classList.remove("hidden");
    }, 10);
}