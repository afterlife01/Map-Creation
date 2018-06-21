//dont delete /*globla google*/ below or you will be done
/*global google*/

import React from "react"
<<<<<<< HEAD
import { compose, withProps, lifecycle, withStateHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, Polyline } from "react-google-maps"
import firebase, { db } from './config/Fire';
=======
import { compose, withProps, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import firebase , {db} from './config/Fire';

>>>>>>> 070bde1eb546e9cb2f6dafb65624f4591f2bd460

const _ = require("lodash");
const { DrawingManager } = require("react-google-maps/lib/components/drawing/DrawingManager");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

const MapWithADrawingManager = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }), lifecycle({
    componentWillMount() {
      const refs = {}
      
      this.setState({
<<<<<<< HEAD
        bounds: null,
=======
        
>>>>>>> 070bde1eb546e9cb2f6dafb65624f4591f2bd460
        markers: [],

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
<<<<<<< HEAD
          const nextCenter = _.get(nextMarkers, '0.position', this.props.center);

=======
          const nextCenter = _.get(nextMarkers, '0.position', this.state.currentLatLng);
          
>>>>>>> 070bde1eb546e9cb2f6dafb65624f4591f2bd460
          this.setState({
            currentLatLng: nextCenter,
            markers: nextMarkers,
          });
          

        },
          
            
      })

    },
  }),
  withStateHandlers(() => ({
    isOpen: false,
  }), {
      onToggleOpen: ({ isOpen }) => () => ({
        isOpen: !isOpen,
      })
    }),
  withScriptjs,
  withGoogleMap,
)(props =>
  <GoogleMap
    ref={props.onMapMounted}
    center={props.currentLatLng}
    defaultZoom={17}
<<<<<<< HEAD
    defaultMapTypeId={'satellite'}
    defaultOptions={{
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      },
    }}

  >

    {/*set data that get from firestore to overlay eg. draw saved data, overlayOption*/}
    <Polygon
    />

    {
      props.temp.map(polyCoords => {
        for (var key in polyCoords) {
          let polygonObject = []
          var value = polyCoords[key]
          for (var key2 in value) {
            var value2 = value[key2]
            polygonObject[key2] = { lat: value2.latitude, lng: value2.longitude }
          }
          return <Polygon path={polygonObject} />
        }
      })
    }


    {/*same as above*/}
    <Polyline
      path={[
      ]}
    />

    {/*same as above*/}
    <Marker
    />

    <DrawingManager

      //call when draw polygon complete
      onPolygonComplete={polygon => {
        var polyCoords = []
        console.log("this polygon length: " + polygon.getPath().getLength());
        //loop for store LatLng to coords array
        polygon.getPath().forEach(function (value) {
          console.log(value.lat(), value.lng());
          polyCoords.push({
=======
    
  >
    {props.isMarkerShown && <Marker position={props.currentLatLng} onClick={props.onMarkerClick} />}
    
    
    <DrawingManager

      onPolygonComplete={polygon => {
        console.log("this polygon length: " + polygon.getPath().getLength());

        var coords = [];


        polygon.getPath().forEach(function (value, index) {
          console.log(value.lat(), value.lng());
          coords.push({
>>>>>>> 070bde1eb546e9cb2f6dafb65624f4591f2bd460
            latitude: value.lat(),
            longitude: value.lng()
          });
        });
<<<<<<< HEAD
        //add coords array to cloud firestore
        db.collection("users").doc("userId").collection("polygon").add({
          //add data here
          polyCoords,
=======

        db.collection("users").doc("userId").collection("polygon").add({
          //add data here
          latlng: coords
>>>>>>> 070bde1eb546e9cb2f6dafb65624f4591f2bd460
        }).then(function () {
          console.log("Document successfully written!");
        })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          });
      }}

      //call when polyline complete
      onPolylineComplete={polyline => {
<<<<<<< HEAD
        var polylineCoords = []
        console.log(polyline.getPath().getLength())

        //loop for store LatLng to coords array
        polyline.getPath().forEach(function (value) {
          console.log(value.lat(), value.lng());
          polylineCoords.push({
            latitude: value.lat(),
            longitude: value.lng()
          });
        });

        //add coords array to cloud firestore
        db.collection("users").doc("userId").collection("polyline").add({
          //add data here
          polylineCoords,

        }).then(function () {
          console.log("Document successfully written!");
        })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          });

=======
        console.log("this polyline length: " + polyline.getPath().getLength());

        var coords = [];


        polyline.getPath().forEach(function (value, index) {
          console.log(value.lat(), value.lng());
          coords.push({
            latitude: value.lat(),
            longitude: value.lng()
          });
        });

        db.collection("users").doc("userId").collection("polyline").add({
          //add data here
          latlng: coords
        }).then(function () {
          console.log("Document successfully written!");
        })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          });
>>>>>>> 070bde1eb546e9cb2f6dafb65624f4591f2bd460
      }}

      //call when marker complete
      onMarkerComplete={marker => {
<<<<<<< HEAD

        var markerCoords = []
        console.log(marker.getPosition())
        //store data to cloud firestore
        markerCoords.push({
=======
        console.log(marker.getPosition().lat(), marker.getPosition().lng())

        var coords = []

        coords.push({
>>>>>>> 070bde1eb546e9cb2f6dafb65624f4591f2bd460
          latitude: marker.getPosition().lat(),
          longitude: marker.getPosition().lng()
        });

        db.collection("users").doc("userId").collection("marker").add({
          //add data here
<<<<<<< HEAD
          markerCoords,

=======
          latlng: coords
>>>>>>> 070bde1eb546e9cb2f6dafb65624f4591f2bd460
        }).then(function () {
          console.log("Document successfully written!");
        })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          });
      }}
<<<<<<< HEAD
      onRectangleComplete={rectangle => {
        console.log(props.queryShape)
      }}
=======


>>>>>>> 070bde1eb546e9cb2f6dafb65624f4591f2bd460
      defaultOptions={{
        drawingControl: true,
        drawingControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.POLYLINE,
            google.maps.drawing.OverlayType.MARKER,
<<<<<<< HEAD
            google.maps.drawing.OverlayType.RECTANGLE,
          ],
        },
        polygonOptions: {

          fillColor: '#BCDCF9',
          strokeColor: '#00FFFF',
          editable: true,

        },
        polylineOptions: {
          strokeColor: '#00AFFF',
          //editable: true,
        },
        markerOption: {
        }
=======

          ],
          polygonOptions: {
          fillColor: '#BCDCF9',

          },
          polylineOptions: {

          }
>>>>>>> 070bde1eb546e9cb2f6dafb65624f4591f2bd460
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
    {props.markers.map((marker, index) =>
      <Marker key={index} position={marker.position} />
    )}
<<<<<<< HEAD
    {props.isMarkerShown && <Marker position={props.center} onClick={props.onMarkerClick} />}
  </GoogleMap>
);

=======
    
  </GoogleMap>
);

class App extends React.PureComponent{
>>>>>>> 070bde1eb546e9cb2f6dafb65624f4591f2bd460


export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.handleClick = this.handleClick.bind(this);
<<<<<<< HEAD
    this.queryPolygon = this.queryPolygon.bind(this)
    this.state = {
      currentLatLng: {
        lat: 13.652383, lng: 100.493872
      },
      isMarkerShown: true,
      temp: [],
      tempPolyline: [],
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



  handleClick() {
=======
    this.state = {
     currentLatLng:{
      lat: 13.652383, lng: 100.493872
     },
      isMarkerShown : true
    }
    
  
  }
  saveMap() {
>>>>>>> 070bde1eb546e9cb2f6dafb65624f4591f2bd460

    this.getGeoLocation();
    this.handleMarkerClick();
    this.handleMarkerClick2();
  }
<<<<<<< HEAD
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
=======
  handleClick(){
    
    this.getGeoLocation();
    this.handleMarkerClick();
    this.handleMarkerClick2();
  }

  
  
  getGeoLocation = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                console.log(position.coords);
                this.setState(prevState => ({
                    currentLatLng: {
                        ...prevState.currentLatLng,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                }))
            }
        )
    }
>>>>>>> 070bde1eb546e9cb2f6dafb65624f4591f2bd460

  componentDidMount() {
    this.handleClick();
  }
  handleMarkerClick2 = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: false })
    }, 5000)
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
<<<<<<< HEAD
    this.setState({ isMarkerShown: true })
  }
  render() {

    return (
      <div>
=======
    
      this.setState({ isMarkerShown: true })
    
  }

  render() {

    return (
      

      <div>
        
        <h2>Map Creation</h2><br />
        <MapWithADrawingManager
        currentLatLng={this.state.currentLatLng}
        isMarkerShown={this.state.isMarkerShown}
         /><br /><br />
        <button onClick={this.handleClick}  className="btn btn-info">Find yourself</button><br /><br />
        <button onClick={this.saveMap} className="btn btn-success">Save Map</button>
        <button onClick={this.logout} style={{ marginLeft: '25px' }} className="btn btn-primary">Logout</button>
>>>>>>> 070bde1eb546e9cb2f6dafb65624f4591f2bd460

        <MapWithADrawingManager
          center={this.state.center}
          isMarkerShown={this.state.isMarkerShown}
          temp={this.state.temp}
          tempPolyline={this.state.tempPolyline}

        /><br /><br />
        <button onClick={this.handleClick} className="btn btn-info">Find yourself</button><br /><br />
        <button onClick={this.queryPolygon} className="btn btn-success">Get shape</button>
        <button onClick={this.logout} style={{ marginLeft: '25px' }} className="btn btn-primary">Logout</button>
      </div>
    )
  }
<<<<<<< HEAD
}
=======
}

export default  App 
>>>>>>> 070bde1eb546e9cb2f6dafb65624f4591f2bd460
