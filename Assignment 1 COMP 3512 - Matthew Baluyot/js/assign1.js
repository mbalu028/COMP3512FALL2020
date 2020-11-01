var map;

function initMap(latitude, longitude) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: latitude,
            lng: longitude
        },
        zoom: 6
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const divB = document.querySelector('div.b section');
    const divA = document.querySelector('div.a section');
    const divC = document.querySelector('div.c section');
    const divD = document.querySelector('div.d section');
    const divE = document.querySelector('div.e section');

    const galleriesAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php';

    fetch(galleriesAPI)
        .then(resp => resp.json())
        .then(galleryData => {
            divA.style.display = "block";
            const galleryList = document.querySelector("#galleryList");
            for (let g of galleryData) {
                // creates list item
                const li = document.createElement('li');
                // populates it with data
                li.textContent = g.GalleryName;
                // if user clicks on the list item
                li.addEventListener('click', (e) => {
                    displayInfoMap(galleryData, e);
                });
                // added to the list
                galleryList.appendChild(li);
            }
        })
        .catch(err => {
            console.log(err)
        });

    // function displays both B and C sections
    function displayInfoMap(galleries, e) {
        const galleryDataArray = galleries;
        const findElement = e.target.textContent;
        const findGallery = galleryDataArray.find(g => g.GalleryName == findElement);
        const imagesAPI = `https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery=${findGallery.GalleryID}`;
        divB.style.display = "block";

        // gets the variables for the ids in the html
        const galleryTitle = document.querySelector('#galleryName');
        const nativeName = document.querySelector('#galleryNative');
        const galleryCity = document.querySelector('#galleryCity');
        const galleryAddr = document.querySelector('#galleryAddress');
        const galleryCountry = document.querySelector('#galleryCountry');
        const galleryWebsite = document.querySelector('#galleryHome');

        // populates the variables with text content from the json 
        galleryTitle.textContent = findGallery.GalleryName;
        nativeName.textContent = findGallery.GalleryNativeName;
        galleryCity.textContent = findGallery.GalleryCity;
        galleryCountry.textContent = findGallery.GalleryCountry;
        galleryAddr.textContent = findGallery.GalleryAddress;
        galleryWebsite.setAttribute('href', findGallery.GalleryWebSite);
        galleryWebsite.textContent = findGallery.GalleryWebSite;

        // grabs the latitutde and longitude from the json to display the map
        initMap(findGallery.Latitude, findGallery.Longitude);

        // starts the second fetch to get the paintings
        fetch(imagesAPI)
            .then(resp2 => resp2.json())
            .then(imageData => {
                displayPaintings(imageData);
            })
            .catch(err => {
                console.log(err)
            });
    }

    // displays the section D and also works the single painting view
    function displayPaintings(paintings) {
        divD.style.display = "block";
        const paintingsList = document.querySelector('#paintingsList');

        for (p of paintings) {
            // creates the elements that the painting display will produce
            const paintingImg = document.createElement('img');
            const paintingP2 = document.createElement('p');
            const paintingP3 = document.createElement('p');
            const paintingP4 = document.createElement('p');
            const li = document.createElement('li');
            paintingImg.setAttribute('src', `https://res.cloudinary.com/funwebdev/image/upload/w_75/art/paintings/square/${p.ImageFileName}`);

            paintingP3.textContent = p.Title;
            paintingP3.setAttribute('id', 'title');
            paintingP2.textContent = p.LastName;
            paintingP2.setAttribute('id', 'artist');
            paintingP4.textContent = p.YearOfWork;
            paintingP4.setAttribute('id', 'year');

            li.appendChild(paintingImg);
            li.appendChild(paintingP2);
            li.appendChild(paintingP3);
            li.appendChild(paintingP4);
            paintingsList.appendChild(li);

            // if the user clicks on the painting the display will change into the single painting view
            li.addEventListener('click', (e) => {
                if (e.target && e.target.nodeName.toLowerCase() == "img") {
                    divA.style.display = "none";
                    divB.style.display = "none";
                    divD.style.display = "none";
                    divE.style.display = "block";


                    const singViewImg = document.createElement('img');
                    const singViewH2 = document.createElement('h2');
                    const singViewP1 = document.createElement('p');
                    const singViewP2 = document.createElement('p');
                    const closeButton = document.createElement('button');

                    singViewImg.setAttribute('src', `https://res.cloudinary.com/funwebdev/image/upload/w_200/art/paintings/square/${p.ImageFileName}`);
                    singViewH2.textContent = p.Title;
                    singViewP1.textContent = p.FirstName + " " + p.LastName + "\n";
                    singViewP2.textContent = p.YearOfWork + ", " + p.Medium + ", " + p.Width + ", " + p.Height + ", " + p.CopyrightText + ", " + p.GalleryName + ", " + p.GalleryCity + ", " + p.MuseumLink + ", " + p.Description;
                    closeButton.textContent = "Close Button";
                    closeButton.setAttribute('id', "closeButton");

                    divE.appendChild(singViewImg);
                    divE.appendChild(singViewH2);
                    divE.appendChild(singViewP1);
                    divE.appendChild(singViewP2);
                    divE.appendChild(closeButton);

                    closeButton.addEventListener("click", (event) => {
                        event.preventDefault();
                        divA.style.display = "block";
                        divB.style.display = "none";
                        divD.style.display = "none";
                        divE.style.display = "none";
                    })
                }
            });
        }
    }
})