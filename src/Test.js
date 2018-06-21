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
// path={[
    //   new google.maps.LatLng(13.6523, 100.4938),
    //   new google.maps.LatLng(13.5544, 134.2465),
    //   new google.maps.LatLng(35.5321, 134.2454),
    //   new google.maps.LatLng(35.5396, 134.2609),
    //   new google.maps.LatLng(35.5460, 134.2622),
    // ]}
        

*/

