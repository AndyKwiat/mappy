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
let placeNames = ["79 Dean Ave.",
    "Walmart",
    "the bookshelf",
"540 Victoria Rd N,",
    "Second Cup",
    "200 Victoria Rd S",
    "Canadian Tire",
    "St.Josephs Health Centre",
    "12 Drew St.",
    "50 Rodney Blvd",
    "85 Steffler Dr",
    "258 Cole Rd",
    "18 Walter St",
    "53 Bennet Ave"

];
placeNames.forEach((item)=>{
    getCoords(item).then((coords)=>{
        if (coords == null ){
            console.log("Can't get item " + item);
            return;
        }

        L.marker(coords).addTo(mymap).bindPopup(item);
       // marker.bindPopup("<b>Hello world!</b><br>I am a popup.")
        places.push({name:item, coords:[parseFloat(coords[0]), parseFloat(coords[1])] });
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


function calcDistance(i1, i2 ,spots){
    let x1 = parseFloat(spots[i1].coords[0]);
    let x2 = parseFloat(spots[i2].coords[0]);
    let y1 = parseFloat(spots[i1].coords[1]);
    let y2 = parseFloat(spots[i2].coords[1]);
    return calcDistanceCoords([x1,y1], [x2,y2]);
}

function calcDistanceCoords( c1, c2 ){
    let dx = c2[0] - c1[0];
    let dy = c2[1] - c1[1];
    return Math.sqrt(dx*dx+dy*dy)*100;// estimate
}
function getDistance( i1, i2 ,spots){
    let idx =  i1 + "->" + i2;
    if ( !distances[idx] ){
        distances[idx] = calcDistance(i1,i2,spots);
    }
    return distances[idx];
}


function measureDistance(routes,spots ){
    let dist = 0;

    for ( let i=0; i < routes.length-1; i++ ){
        dist+=getDistance(routes[i],routes[i+1],spots);

    }
    return dist;


}

function measureAndShowDist( routes, algo, color ,spots){
    console.log("--------" + algo+ "----------");
   let dist = measureDistance(routes,spots);
        let coords = routes.map(x=>spots[x].coords);
        L.polyline(coords, {color: color, weight:5}).addTo(mymap);
        console.log("Distance: (" + coords.length+")-->" + dist);

    return dist;
}


function dumpRoutes(routes,spots ){
    for (let i=0; i < routes.length; i++ ){
        console.log(i+"-> " + spots[routes[i]].name );
    }
}

function findClosest( p0, candidates,spots ){
    let winner = candidates[0];
    let minVal = getDistance(p0, winner ,spots);
    for ( let i=1; i < candidates.length; i++ ){
        let dist = getDistance(p0, candidates[i],spots);
        if ( dist < minVal ){
            minVal = dist;
            winner= candidates[i];
        }
    }
    return winner;
}
//-algorithms----------------

function defaultRandomRoutes(spots){
    let routes=[];
    for (let i=0; i< spots.length; i++ ){
        routes.push(i);
    }
    routes.push(0); // go home
    return routes;
}

function closestNext(spots){
    let routes=[0];
    let remainders= [];
    for ( let i=1; i <spots.length; i++ ){
        remainders.push(i);
    }
    let cur=0;
    while ( remainders.length > 0 ){
        let closest = findClosest(cur, remainders,spots);
        remainders = remainders.filter(x=>x !== closest);
        cur = closest;
        routes.push(closest);
    }

    routes.push(0); // go home
    return routes;
}
function getPermutations( ar ){

    if (ar.length <=1 ){
        return [ar];
    }
    let res = [];
    for (let i=0; i < ar.length; i++ ){
        let copy = [...ar];
        let val = copy[i];
        copy.splice(i,1);
        let perms = getPermutations(copy);
        for (let i=0; i < perms.length; i++ ) {
            perms[i].unshift(val);
            res.push(perms[i]);
        }
    }
    return res;

}
function bruteForce(spots){
    let remainders = [];
    for ( let i=1; i <spots.length; i++ ){
        remainders.push(i);
    }

    let perms = getPermutations( remainders);
    let winner;
    let min;
    for (let i=0; i < perms.length; i++ ){
        perms[i].push(0);
        perms[i].unshift(0);
        let dist = measureDistance(perms[i]);
        if ( !winner || dist < min ){
            min = dist;
            winner = i;
        }
    }
    return perms[winner];

}
function findClosestCoords(baseCoord, otherCoords ){
    let winner = 0;
    let min = calcDistanceCoords(baseCoord, otherCoords[0]);
    for( let i=1; i < otherCoords.length; i++ ){
        let dist = calcDistanceCoords(baseCoord, otherCoords[i]);
        if ( dist < min ){
            min = dist;
            winner = i;
        }
    }
    return winner;
}
function findClusters(numClusters, candidates, spots, show=false ){
    let k = []; // coords of cluster
    let members=[];

    for(let i=0; i < numClusters; i++ ){
        k.push(spots[i].coords);   // random placement
        members.push([]);
    }
    for (let iter =0; iter< 47; iter++ ) {
        let change = 0;
        for(let i=0; i < numClusters; i++ ){
            members[i] = [];
        }
        for (let i = 0; i < candidates.length; i++) {
            let place =spots[candidates[i]];
            let closestIndex = findClosestCoords(place.coords, k);
            members[closestIndex].push(place);
        }

        for (let i = 0; i < k.length; i++) {
            let kids = members[i];
            let total = [0, 0];
            for (let j = 0; j < kids.length; j++) {
                total[0] = total[0] + kids[j].coords[0];
                total[1] = total[1] + kids[j].coords[1];
            }
            total[0] = total[0] / kids.length;
            total[1] = total[1] / kids.length;


            change += Math.abs(k[i][0] - total[0]) + Math.abs(k[i][1] - total[1]);
            k[i] = total;

        }
        console.log("change--->" + change * 100);
        if ( change *100 < .1 ){
            break;
        }
    }
    if ( show ) {
        for (let i = 0; i < k.length; i++) {
            var circle = L.circle(k[i], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 150
            }).addTo(mymap);
            let kids = members[i];
            for (let j = 0; j < kids.length; j++) {
                L.polyline([k[i], kids[j].coords], {color: 'green', weight: 1}).addTo(mymap);
            }
        }
    }
    return members;

}
function clusters(spots){
    let remainders = [];
    for ( let i=1; i <spots.length; i++ ){
        remainders.push(i);
    }
    findClusters(5, remainders,spots,true);
}
function onEverythingLoaded(){

    // measureAndShowDist(defaultRandomRoutes(),"default -random", 'red');

    measureAndShowDist(closestNext(places), "closestNext", 'blue' ,places);

    //measureAndShowDist(bruteForce(), "bruteForce", 'yellow');
    let routes = closestNext(places);
    dumpRoutes(routes,places);

    clusters(places);


    console.log("OK");

}