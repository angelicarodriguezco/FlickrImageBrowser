import { fetchImages} from "../services/flickrService";

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const imageList = document.getElementById("images");
    const modal = document.getElementById("image-details");
    const modalContainer = document.getElementById("image-details-container");
    const backButton = document.getElementById("back-button");

    function displayImages(query) {
        fetchImages(query).then(images => {
            imageList.innerHTML = "";
            if (images.length > 0) {
                images.forEach(photo => {
                    const imgUrl = 'https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_w.jpg';
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

    function showImageDetials(photo) {
        const imgUrl = 'https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg'
        modalContainer.innerHTML = '<h2>${photo.title}</h2>\n' +
            '            <img src="${imgUrl}" alt="${photo.title}" />\n' +
            '            <p><strong>Photo ID:</strong> ${photo.id}</p>';

        modal.classList.add("active");
        document.body.style.overflow = "hidden";

        backButton.addEventListener("click", function () {
            modal.classList.remove("active");
            document.body.style.overflow;
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

