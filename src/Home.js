//dont delete /*global google*/ below or you will be done
/*global google*/

//let จบลูปหาย - var ตรงกันข้าม 
import React from "react"
import { compose, withProps, lifecycle, } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, Polyline, } from "react-google-maps"
import firebase, { db } from './config/Fire';
import MapControl from './components/MapControl'

const _ = require("lodash");
const { DrawingManager } = require("react-google-maps/lib/components/drawing/DrawingManager");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

const MapWithADrawingManager = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `35vw` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentDidMount() {
      const refs = {}
      let arrayOfShapes = []

      this.setState({
        markers: [],
        testState: {},
        option: {
          fillColor: '#BCDCF9',
          strokeColor: '#FF4500',
          editable: true,
        },

        onOverlaySave: () => {

          this.setState({
            testState: arrayOfShapes
          }, ()=> {
            console.log("click!", this.state.testState)
          })


          //   //add coords array to cloud firestore
          //   db.collection("users").add({
          //     //add data here
          //     arrayOfShapes
          //   }).then(function () {
          //     console.log("Document successfully written!");
          //   })
          //     .catch(function (error) {
          //       console.error("Error writing document: ", error);
          //     });
        },

        onOverlayAdd: (overlay) => {
          // console.log("adsfwe", overlay)


          var Overlay = overlay.overlay //get overlay object data
          var OverlayType = overlay.type //get type of overlay

          if (OverlayType === "rectangle") {
            console.log("get rekt!", Overlay)
            arrayOfShapes.push({
              "overlayType": OverlayType,
              "coords": Overlay
            })
          }

          if (OverlayType === "polygon") {
            console.log("get poly!", Overlay)
            //console.log("area is ", google.maps.geometry.spherical.computeArea(Overlay.getPath()))
            arrayOfShapes.push({
              "overlayType": OverlayType,
              "coords": Overlay
            })

          }
          if (OverlayType === "polyline") {
            console.log("get polyL!", Overlay)
            arrayOfShapes.push({
              "overlayType": OverlayType,
              "coords": Overlay
            })

          }

          if (OverlayType === "marker") {
            console.log("get markZuker!", Overlay)
            arrayOfShapes.push({
              "overlayType": OverlayType,
              "coords": Overlay
            })

          }

        },

        onMapMounted: ref => {
          refs.map = ref;
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();
          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.props.center);

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });

        },
      })
    },//end of willM
  }),//end of lifeclycle

  withScriptjs,//end of withScriptjs
  withGoogleMap,//end of withGoogleMap
)(props =>
  <GoogleMap
    ref={props.onMapMounted}
    center={props.center}
    defaultZoom={17}
    defaultMapTypeId={'satellite'}
    defaultOptions={{
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      },
    }}
  >
    <MapControl
      position={google.maps.ControlPosition.BOTTOM_CENTER}>
      <div>
        <button className="btn btn-info"
          onClick={props.onOverlaySave}>
          Hello world!
        </button>
      </div>
    </MapControl>

    <Polyline />
    {/*set data that get from firestore to overlay eg. draw saved data, overlayOption*/}
    {
      props.temp.map(polyCoords => {
        for (var key in polyCoords) {
          let polygonObject = []
          var value = polyCoords[key]
          for (var key2 in value) {
            var value2 = value[key2]
            polygonObject[key2] = { lat: value2.latitude, lng: value2.longitude }
          }
          return <Polygon
            //ref={(ref) => { this.ref = ref; }}
            path={polygonObject}
            onClick={() => console.log("poly ob", polygonObject)}
          />
        }
      })
    }
    {
      props.tempMarker.map(markerCoords => () => {
        for (var key in markerCoords) {
          let markerObject = {}
          var value = markerCoords[key]
          for (var key2 in value) {
            var value2 = value[key2]
            markerObject = { lat: value2.latitude, lng: value2.longitude }
          }
          return <Marker position={markerObject} />
        }
      })
    }
    <DrawingManager

      onOverlayComplete={overlay => {
        props.onOverlayAdd(overlay)
      }}

      onRectangleComplete={rectangle => {
        //props.onRectangleAdd(rectangle)
      }}

      //call when draw polygon complete
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

      //call when polyline complete
      onPolylineComplete={polyline => {

        // var polylineCoords = []
        // console.log(polyline.getPath().getLength())

        // //loop for store LatLng to coords array
        // polyline.getPath().forEach(function (value) {
        //   console.log(value.lat(), value.lng());
        //   polylineCoords.push({
        //     latitude: value.lat(),
        //     longitude: value.lng()
        //   });
        // });

        // //add coords array to cloud firestore
        // db.collection("users").doc("userId").collection("polyline").add({
        //   //add data here
        //   polylineCoords,

        // }).then(function () {
        //   console.log("Document successfully written!");
        // })
        //   .catch(function (error) {
        //     console.error("Error writing document: ", error);
        //   });

      }}

      //call when marker complete
      onMarkerComplete={marker => {
        console.log("stateee", props.testState)
        // var markerCoords = []
        // console.log(marker.getPosition())
        // //store data to cloud firestore
        // markerCoords.push({
        //   latitude: marker.getPosition().lat(),
        //   longitude: marker.getPosition().lng()
        // });

        // db.collection("users").doc("userId").collection("marker").add({
        //   //add data here
        //   markerCoords,

        // }).then(function () {
        //   console.log("Document successfully written!");
        // })
        //   .catch(function (error) {
        //     console.error("Error writing document: ", error);
        //   });
      }}

      defaultOptions={{
        drawingControl: true,
        drawingControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.POLYLINE,
            google.maps.drawing.OverlayType.MARKER,
            google.maps.drawing.OverlayType.RECTANGLE,
          ],
        },
        polygonOptions: props.option
        ,
        polylineOptions: {
          strokeColor: '#00AFFF',
          editable: true,
        },
        markerOptions: {
          draggable: true
        },
        rectangleOptions: {
          draggable: true,
          editable: true
        }
      }

      }
    />
    <SearchBox
      ref={props.onSearchBoxMounted}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="ค้นหาสถานที่..."
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `10px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    {
      props.markers.map((marker, index) =>
        <Marker key={index} position={marker.position}
        />

      )
    }

    {props.isMarkerShown && <Marker position={props.center} onClick={props.onMarkerClick} />}
  </GoogleMap>
);



export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.queryPolygon = this.queryPolygon.bind(this)
    this.querymarker = this.querymarker.bind(this);
    this.state = {
      currentLatLng: {
        lat: 13.652383, lng: 100.493872
      },
      isMarkerShown: true,
      temp: [],
      tempMarker: [],
    }
  }
  queryPolygon() {
    let arr = []
    db.collection("users").doc("userId").collection("polygon").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        arr.push(doc.data())
      });
    });
    this.setState({
      temp: arr
    })
  }

  querymarker() {
    let arr = []
    db.collection("users").doc("userId").collection("marker").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        arr.push(doc.data())
      });
    });
    this.setState({
      tempMarker: arr
    })
  }

  handleClick() {
    this.getGeoLocation();
    this.handleMarkerClick();
    this.handleMarkerClick2();
  }
  getGeoLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log(position.coords);
        this.setState(prevState => ({
          center: {
            ...prevState.center,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }))
      }
    )
  }

  componentDidMount() {
    this.handleClick();
  }
  handleMarkerClick2 = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: false })
    }, 5000)
  }

  logout() {
    firebase.auth().signOut();
    this.setState({ user: null });
  }
  handleMarkerClick = () => {
    this.setState({ isMarkerShown: true })
  }
  render() {

    return (
      <div>
        <MapWithADrawingManager
          center={this.state.center}
          isMarkerShown={this.state.isMarkerShown}
          temp={this.state.temp}
          tempMarker={this.state.tempMarker}
        /><br /><br />
        {/*
<button onClick={this.handleClick} className="btn btn-info">Find yourself</button> <br /> <br />
        <button onClick={this.queryPolygon} className="btn btn-success">Get shape</button>
        <button onClick={this.querymarker} className="btn btn-success">Get shape marker</button>
        <button onClick={this.logout} style={{ marginLeft: '25px' }} className="btn btn-primary">Logout</button>
*/}


      </div>
    )
  }
}