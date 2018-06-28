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
        

  //withstate
  withState('count', 'setCount', 0),
  withHandlers({
    incrementCount: props => event => {
      // props would contain copy prop. 
      props.setCount(props.count + 1)
    },
    otherExample: () => event => {
      // If you didn't need props in your handler
    },
    otherIncrementCountExample: ({ count, setCount }) => () => {
      // you can exclude event also
      setCount(count + 1);
    }
  }),



  //switch case for save to arrayOfShapes
  // switch (OverlayType) {
          //   case "rectangle": return (
          //     arrayOfShapes.push({
          //       "overlayType": OverlayType,
          //       "coords": Overlay
          //     })
          //   );

          //   case "polygon": return (
          //     console.log("from switch ", OverlayType)
          //   );

          //   case "polyline": return (
          //     console.log("from switch ", OverlayType)
          //   );

          //   case "marker": return (
          //     console.log("from switch ", OverlayType)
          //   );
          //   default: return 0
          // }


          onPolygonComplete={polygon => {

        // var polyCoords = []
        // //loop for store LatLng to coords array
        // polygon.getPath().forEach(function (value) {
        //   console.log(value.lat(), value.lng());
        //   polyCoords.push({
        //     latitude: value.lat(),
        //     longitude: value.lng()
        //   });
        // });
        // console.log("pcoords", polyCoords)

        // //add coords array to cloud firestore
        // db.collection("users").doc("userId").collection("polygon").add({
        //   //add data here
        //   polyCoords,
        // }).then(function () {
        //   console.log("Document successfully written!");
        // })
        //   .catch(function (error) {
        //     console.error("Error writing document: ", error);
        //   });
      }
      }



      แปลงตารางเมตรเป็นไร่
      ตัวอย่าง แปลงเนื้อที่ 7,321 ตารางเมตรเป็น ไร่ — งาน — ตารางวา

A. ไร่ = Shape_Area/1600 = 7,321/1,600 = 4 เศษ 921 ไร่

B. งาน = เศษที่ได้จาก A. /400 = 921/400 = 2 เศษ 121 งาน

C.ตารางวา = เศษที่ได้จาก B /4 = 121/4 = 30.25 ตารางวา

สรุป 7,321 ตารางเมตร = 4 ไร่ 2 งาน 30.25 ตารางวา



//compute area
            if (OverlayType === "polygon") {
              console.log(
                "area is ",
                area,
              );
            }

            //compute length
            if (OverlayType === "polyline") {
              console.log(
                "length is ",
                length,
                "เมตร"
              );
            }



            {temp.map(polyCoords => {
      for (var key in polyCoords) {
        let polygonObject = [];
        var value = polyCoords[key];
        for (var key2 in value) {
          var value2 = value[key2];
          polygonObject[key2] = { lat: value2.latitude, lng: value2.longitude };
        }
        return;
      }
    })}
    {tempMarker.map(markerCoords => () => {
      for (var key in markerCoords) {
        let markerObject = {};
        var value = markerCoords[key];
        for (var key2 in value) {
          var value2 = value[key2];
          markerObject = { lat: value2.latitude, lng: value2.longitude };
        }
        return;
      }
    })}
*/

