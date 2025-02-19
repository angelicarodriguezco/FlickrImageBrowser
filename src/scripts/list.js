import {fetchImages} from "../services/FlickrService";

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const imageList = document.getElementById("images");
    const modal = document.getElementById("image-modal");
    const modalContainer = document.getElementById("modal-content");
    const backButton = document.getElementById("back-button");


    const loadingMessage = document.createElement("div");
    loadingMessage.innerHTML = "Loading images...";
    imageList.appendChild(loadingMessage);

    function displayImages(query) {
        loadingMessage.style.display = "block";

        fetchImages(query).then(images => {
            console.log(images);
            imageList.innerHTML = "";
            loadingMessage.style.display = "none";


            if (images.length > 0) {
                images.forEach(photo => {
                    const imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_w.jpg`;
                    const imgElement = document.createElement("img");
                    imgElement.src = imgUrl;
                    imgElement.alt = photo.title || "Flickr Image";
                    imgElement.classList.add("image-item");
                    imgElement.dataset.id = photo.id;

                    imgElement.addEventListener("click", function () {
                        showImageDetails(photo);
                    });

                    imageList.appendChild(imgElement);
                });
            } else {
                imageList.innerHTML = "<p>No images found.</p>";
            }
        }).catch(error => {
            console.error("Error fetching images:", error);
        });
    }

    function showImageDetails(photo) {
        const imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
        const modalTitle = document.getElementById("modal-title");
        const modalImage = document.getElementById("modal-image");
        const modalDescription = document.getElementById("modal-description");

        modalTitle.textContent = photo.title;
        modalImage.src = imgUrl;
        modalDescription.innerHTML = `<strong>Photo ID:</strong> ${photo.id}`;

        modal.style.display = "block";
        document.body.style.overflow = "hidden";

        backButton.addEventListener("click", function () {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }

    searchInput.addEventListener("input", function () {
        const query = searchInput.value;
        if (query.trim() !== "") {
            displayImages(query);
        }
    });

    displayImages('nature');
    });

