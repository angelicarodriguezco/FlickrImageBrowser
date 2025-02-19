const apiKey = "426b851b1c5883e41e0403fa08f710ae";

function fetchImages(query = "nature") {
    const url = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&text=${query}&format=json&nojsoncallback=1&per_page=20';

    return fetch(url)
        .then(respone => respone.json())
        .then(data => data.photos.photo)
        .catch(error => {
            console.error("Error fetching images: " + error);
            return[];
        });
}

function fetchImageDetails(imageId) {
    const url = 'https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${apiKey}&photo_id=${imageId}&format=json&nojsoncallback=1';

    return fetch(url)
        .then(response => respone.json())
        .then(data => data.photo)
        .catch(error => {
            console.error("Error fetching image details: " + error);
            return null;
        });
}

export { fetchImages, fetchImageDetails}