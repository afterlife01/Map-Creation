/*

//add data to firestore
console.log(marker.getPosition().lat(), marker.getPosition().lng())
//store data to cloud firestore
markerCoords.push({
    latitude: marker.getPosition().lat(),
    longitude: marker.getPosition().lng()
});

db.collection("users").doc("userId").collection("marker").add({
    //add data here
    markerCoords,

}).then(function () {
    console.log("Document successfully written!");
})
    .catch(function (error) {
        console.error("Error writing document: ", error);
    });



//query overlay from firestore
db.collection("users").doc("userId").collection("polygon").get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        console.log(doc.id, " => ", doc.data());
    });
});


//click polygon


//coords to draw polygon on map
var jpath =
  [
    { lat: 13.7739818, lng: 100.546488 },
    { lat: 13.5544, lng: 134.2465 },
    { lat: 35.5321, lng: 134.2454 },
    { lat: 35.5396, lng: 134.2609 },
    { lat: 35.5460, lng: 134.2622 },
  ]
        

*/

