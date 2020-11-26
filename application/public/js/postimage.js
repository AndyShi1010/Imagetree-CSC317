function displayFileName(element, event) {
    let fileName = element.value;
    while (element.parentNode.parentNode.getElementsByClassName('filebox-preview')[0]) {
        element.parentNode.parentNode.removeChild(element.parentNode.parentNode.getElementsByClassName('filebox-preview')[0]);
    }
    if (fileName.trim() != "") {
        element.parentNode.insertAdjacentHTML('afterend', 
        '<div class="filebox-preview"><img class="image-preview" src="' + URL.createObjectURL(event.target.files[0]) + '"></img><p class="filebox-filename">' + fileName.split('\\').pop() + '</p><a class="clear-file-link" onclick="clearFile(this);">Clear</a></div>');
        // element.parentNode.querySelector(".rendered-filebox").style.background = "var(--accent-color)";
        // element.parentNode.querySelector(".rendered-filebox").style.color = "white";
        // element.parentNode.insertAdjacentHTML('afterend', '<img class="image-preview" src="' + URL.createObjectURL(event.target.files[0]) + '"></img>');
        // element.parentNode.querySelector(".rendered-filebox").innerHTML = "File Added";
        // element.parentNode.querySelector(".rendered-filebox").classList.add("file-added");
        // setTimeout(function() {
        //     element.parentNode.querySelector(".rendered-filebox").innerHTML = "Select File";
        //     element.parentNode.querySelector(".rendered-filebox").classList.remove("file-added");
        // }, 2000);
        element.parentNode.parentNode.insertAdjacentHTML('afterbegin', '<label class="temp-label">Upload File</label>');
        element.parentNode.style.display = "none";
    
    }
}

function clearFile(element) {
    element.parentNode.parentNode.querySelector(".temp-label").remove();
    element.parentNode.parentNode.querySelector(".input-file").style.display = "block";
    element.parentNode.parentNode.querySelector(".input-file").querySelector(".filebox").value = null;
    // while (element.parentNode.parentNode.getElementsByClassName('filebox-name')[0] != null) {
    
    // }
    element.parentNode.parentNode.removeChild(element.parentNode.parentNode.getElementsByClassName('filebox-preview')[0]);
    // element.parentNode.removeChild(element);
} 

function loadImage(event) {
    let image = URL.createObjectURL(event.target.files[0]);

}