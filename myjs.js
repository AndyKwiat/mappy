var mymap = L.map('mapid').setView([43.5448, -80.2482], 13);

/*var circle = L.circle([43.5448, -80.2482], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);*/

/*var marker = L.marker([43.5448, -80.2482]).addTo(mymap);
var m2 = L.marker([43.5448,-80.2462]).addTo(mymap);*/

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWt3aWF0IiwiYSI6ImNrODdqOGlqejAwanMzZm5tMTBvMmp5NmoifQ.igfG4pPw8BufL5PKy1BIkA'
}).addTo(mymap);

async function getCoords(place) {
    var value = getCookie("coords"+ place).split(",");
    if (value && value != "" ){
        return value;
    }

    var addr = encodeURIComponent(place + ",guelph, ontario");
    var url3 = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + addr + ".json?access_token=pk.eyJ1IjoiYWt3aWF0IiwiYSI6ImNrODdqOGlqejAwanMzZm5tMTBvMmp5NmoifQ.igfG4pPw8BufL5PKy1BIkA"


    return fetch(url3, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then((response) => {
        return response.json();
    })
        .then((data) => {
            console.log(data);
            let coords = data.features[0].center.reverse();
            setCookie("coords"+place,coords,30);
            return coords;});
/*            L.marker(coords).addTo(mymap);

            var popup = L.popup()
                .setLatLng(latlng)
                .setContent('<p>Hello world!<br />This is a nice popup.</p>')
                .openOn(mymap);


        });*/
}
let places=[];
let placeNames = ["15 Boulder Cr.","79 Dean Ave.","the bookshelf",  "Second Cup", "Angel's Diner",
 "Canadian Tire", "Walmart","Molloy's"];
placeNames.forEach((item)=>{
    getCoords(item).then((coords)=>{
        if (coords == null ){
            console.log("Can't get item " + item);
            return;
        }

        L.marker(coords).addTo(mymap);
        places.push({name:item, coords:coords });
        if (places.length >= placeNames.length){
            onEverythingLoaded();
        }

    });
});




function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}



// ROUTING /DIRECTIONS

/*var url="https://api.mapbox.com/directions/v5/mapbox/driving?access_token=pk.eyJ1IjoiYWt3aWF0IiwiYSI6ImNrODdqOGlqejAwanMzZm5tMTBvMmp5NmoifQ.igfG4pPw8BufL5PKy1BIkA"
fetch(url, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body:"coordinates=-80.2482,43.5448;-80.2462,43.5448&&steps=true"
}).then((response) => {
    return response.json();
})
    .then((data) => {
        console.log(data);
    });*/

let distances={};
function calcDistance(i1, i2 ){
    let x1 = parseFloat(places[i1].coords[0]);
    let x2 = parseFloat(places[i2].coords[0]);
    let y1 = parseFloat(places[i1].coords[1]);
    let y2 = parseFloat(places[i2].coords[1]);
    let dx = x2-x1;
    let dy = y2-y1;
    return Math.sqrt(dx*dx+dy*dy)*100;// estimate
}
function getDistance( i1, i2 ){
    let idx =  i1 + "->" + i2;
    if ( !distances[idx] ){
        distances[idx] = calcDistance(i1,i2);
    }
    return distances[idx];
}
function onEverythingLoaded(){
    console.log("OK");
    console.log("boulder to booksehlf:" + getDistance( 0,2) );
    console.log("dean to bookshelf:" + getDistance( 1,2));
}