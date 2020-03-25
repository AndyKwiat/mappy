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



var url="https://api.mapbox.com/directions/v5/mapbox/driving?access_token=pk.eyJ1IjoiYWt3aWF0IiwiYSI6ImNrODdqOGlqejAwanMzZm5tMTBvMmp5NmoifQ.igfG4pPw8BufL5PKy1BIkA"
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
    });
var feature;
var addr = encodeURIComponent("the bookshelf, guelph, ontario");
var url3 ="https://api.mapbox.com/geocoding/v5/mapbox.places/"+addr+".json?access_token=pk.eyJ1IjoiYWt3aWF0IiwiYSI6ImNrODdqOGlqejAwanMzZm5tMTBvMmp5NmoifQ.igfG4pPw8BufL5PKy1BIkA"
//var url2="https://api.mapbox.com/geocoding/v5/mapbox.places/guelph.json?access_token=pk.eyJ1IjoiYWt3aWF0IiwiYSI6ImNrODdqOGlqejAwanMzZm5tMTBvMmp5NmoifQ.igfG4pPw8BufL5PKy1BIkA"
fetch(url3, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
    }
   // body:"coordinates=-80.2482,43.5448;-80.2462,43.5448&&steps=true"
}).then((response) => {
    return response.json();
})
    .then((data) => {
        feature=data;
        console.log(data);
        let coords =feature.features[0].center.reverse();
        L.marker(coords).addTo(mymap);

    });

