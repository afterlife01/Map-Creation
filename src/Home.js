//dont delete /*global google*/ below or you will be done
/*global google*/

//let จบลูปหาย - var ตรงกันข้าม
import React from "react";
import { compose, withProps, lifecycle } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, Polyline } from "react-google-maps";
import firebase, { db } from "./config/Fire";
import MapControl from "./components/MapControl";
import Dock from "./components/Dock";
import Popup from "reactjs-popup";

const _ = require("lodash");
const {
  DrawingManager
} = require("react-google-maps/lib/components/drawing/DrawingManager");
const {
  SearchBox
} = require("react-google-maps/lib/components/places/SearchBox");

const MapWithADrawingManager = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `35vw` }} />,
    mapElement: <div style={{ height: `100%` }} />,
    center: { lat: 13.7739718, lng: 100.4852024 },
  }),
  lifecycle({
    componentDidMount() {
      const refs = {};
      let arrayOfShapes = [];

      this.setState({
        markers: [],
        shapeState: [],

        onOverlayQuery: () => {

          let arr = [];
          db.collection("shapes")
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                arr.push(doc.data());
              });
            });
        },

        onOverlaySave: () => {
          this.setState(
            {
              testState: arrayOfShapes
            },
            () => {
              console.log("click!", this.state.testState);
            }
          );
          //add coords array to cloud firestore
          db.collection("shapes")
            .add({
              //add data here
              arrayOfShapes
            })
            .then(function () {
              console.log("Document successfully written!");
            })
            .catch(function (error) {
              console.error("Error writing document: ", error);
            });
        },
        onSquereMetersTrans: () => {

          //คำนวนพื้นที่เป็นไร งาน ตารางวา - ต้องย้ายไปเป็นฟังก์ชั่นแยกต่างหาก
          let rnwString = "0 ตารางวา"
          var rai, ngan, wa, temp1, temp2, area

          rai = Math.floor(area / 1600)
          temp1 = area % 1600
          ngan = Math.floor(temp1 / 400)
          temp2 = temp1 % 400
          wa = parseFloat((temp2 / 4).toFixed(3), 10)

          if (rai > 0) {
            rnwString = ""
            rnwString = rnwString + rai + " ไร่ "
          }
          if (ngan > 0) {
            rnwString = rnwString + ngan + " งาน "
          }
          if (wa > 0) {
            rnwString = rnwString + wa + " ตารางวา "
          }

          console.log("พื้นที่คือ ", rnwString)
        },
        onOverlayAdd: overlay => {
          var Overlay = overlay.overlay; //get overlay object data
          var OverlayType = overlay.type; //get type of overlay
          var OverlayCoords = [];

          if (OverlayType === "polygon" || OverlayType === "polyline") {
            //loop for store LatLng to coords array

            var area = google.maps.geometry.spherical.computeArea(Overlay.getPath())
            var length = google.maps.geometry.spherical.computeLength(Overlay.getPath())

            //push data that can save to firestore to object
            Overlay.getPath().forEach(function (value) {
              OverlayCoords.push({
                lat: value.lat(),
                lng: value.lng()
              });
            });
          }

          if (OverlayType === "marker") {
            //push data in to array
            OverlayCoords.push({
              lat: Overlay.getPosition().lat(),
              lng: Overlay.getPosition().lng()
            });
          }

          arrayOfShapes.push({
            OverlayType,
            OverlayCoords,
            userId: "userId"
          });

          console.log("#overlay in this arr ", arrayOfShapes);
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
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location
          }));
          const nextCenter = _.get(
            nextMarkers,
            "0.position",
            this.props.center
          );

          this.setState({
            center: nextCenter,
            markers: nextMarkers
          });
        },

        getGeoLocation: () => {
          navigator.geolocation.getCurrentPosition(position => {
            console.log(position.coords);
            this.setState({
              center: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              },
            });
          });
        },

      });
    } //end of willM
  }), //end of lifeclycle

  withScriptjs, //end of withScriptjs
  withGoogleMap //end of withGoogleMap
)(props => (

  <GoogleMap
    ref={props.onMapMounted}
    center={props.center}
    defaultZoom={17}
    defaultMapTypeId={"satellite"}
    defaultOptions={{
      zindex: 0,
      fullscreenControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      }
    }}
  >
    <MapControl
      position={google.maps.ControlPosition.BOTTOM_CENTER}>
      <div>
        <button className="btn btn-info" onClick={props.onOverlaySave}>
          Save!
        </button>

        <button className="btn btn-info" onClick={props.onOverlayQuery}>
          Get shape!
        </button>

        <button className="btn btn-info" onClick={props.getGeoLocation}>
          Find yourself!
        </button>

        <button className="btn btn-info" onClick={() => console.log("dont try this at home")}>
          Create plan
        </button>

        <Popup trigger={<button> Trigger</button>} position="right center">
          <div>Popup content here !!</div>
        </Popup>

      </div>
    </MapControl>

    <MapControl position={google.maps.ControlPosition.TOP_RIGHT}>
      <Dock />
    </MapControl>

    <Polyline />
    {/*set data that get from firestore to overlay eg. draw saved data, overlayOption*/}

    <DrawingManager
      onOverlayComplete={
        overlay => {
          props.onOverlayAdd(overlay);
        }
      }
      defaultOptions={{
        drawingControl: true,
        drawingControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.POLYLINE,
            google.maps.drawing.OverlayType.MARKER,
            google.maps.drawing.OverlayType.RECTANGLE
          ]
        },
        polygonOptions: {
          strokeColor: "#ff8000",
          editable: true
        },
        polylineOptions: {
          strokeColor: "#ff8000",
          editable: true
        },
        markerOptions: {
          draggable: true
        },
        rectangleOptions: {
          draggable: true,
          editable: true
        }
      }}
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
          textOverflow: `ellipses`
        }}
      />
    </SearchBox>
    {
      props.markers.map((marker, index) => (
        <Marker key={index} position={marker.position} />
      ))
    }

  </GoogleMap>
));



export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }
  logout() {
    firebase.auth().signOut();
    this.setState({ user: null });
  }
  render() {
    return (
      <div>

        <MapWithADrawingManager />

      </div>
    );
  }
}
