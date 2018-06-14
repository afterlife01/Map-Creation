/*global google*/
import React from "react"
import { compose, withProps, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import firebase from './config/Fire';


const _ = require("lodash");
const overlaysRef = firebase.database().ref('overlays');
const { DrawingManager } = require("react-google-maps/lib/components/drawing/DrawingManager");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
const MapWithADrawingManager = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `675px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
    
  }), lifecycle({
    componentWillMount() {
      const refs = {}
      
      this.setState({
        
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
          const nextCenter = _.get(nextMarkers, '0.position', this.state.currentLatLng);
          
          this.setState({
            currentLatLng: nextCenter,
            markers: nextMarkers,
          });

        },
          
            
      })
    },
      
  }),
  withScriptjs,
  withGoogleMap,
)(props =>
  <GoogleMap
    ref={props.onMapMounted}
    center={props.currentLatLng}
    defaultZoom={17}
    
  >
    {props.isMarkerShown && <Marker position={props.currentLatLng} onClick={props.onMarkerClick} />}
    
    
    <DrawingManager

      onPolygonComplete={polygon => {
          var coordinates = (polygon.getPath().getArray());
          console.log(coordinates);
          polygon.setEditable(true);
      }}

      onPolylineComplete={polyline => {
        //overlaysRef.push(polyline.getPath().getArray())
        console.log(polyline.getPath().getArray())
      }}

      onRectangleComplete={rectangle => {
        console.log(rectangle.getBounds())
        overlaysRef.push(rectangle.getBounds())
      }}

      onMarkerComplete={marker => {
        console.log(marker.getPosition())
        //overlaysRef.push(marker.getPosition())
      }}

      onCircleComplete={circle => {
        console.log(circle.getBounds())
        overlaysRef.push(circle.getBounds())
      }}

      defaultOptions={{

        drawingControl: true,
        drawingControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.POLYLINE,
            google.maps.drawing.OverlayType.RECTANGLE,
            google.maps.drawing.OverlayType.MARKER,
            google.maps.drawing.OverlayType.CIRCLE,

          ],
        },
        rectangleOptions: {
          fillColor: '#BCDCF9',

        },
        circleOptions: {
          fillColor: '#BCDCF9',

        },
        polygonOptions: {
          fillColor: '#BCDCF9',

        },
        polylineOptions: {

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
  </GoogleMap>
);

class App extends React.PureComponent{

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
     currentLatLng:{
      lat: 13.652383, lng: 100.493872
     },
      isMarkerShown : false
    }
    
  
  }
  saveMap() {

  }
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

  componentDidMount() {
    this.handleClick();
  }
  handleMarkerClick2 = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: false })
    }, 6000)
  }

  logout() {
    firebase.auth().signOut();
    this.setState({ user: null });
  }
  handleMarkerClick = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }

  render() {

    return (
      

      <div>
        
        <h2>Map Creation</h2><br />
        <MapWithADrawingManager
        currentLatLng={this.state.currentLatLng}
        isMarkerShown={this.state.isMarkerShown}
        currentLocation={this.props.currentLatLng} /><br /><br />
        <button onClick={this.handleClick}  className="btn btn-info">Find yourself</button><br /><br />
        <button onClick={this.saveMap} className="btn btn-success">Save Map</button>
        <button onClick={this.logout} style={{ marginLeft: '25px' }} className="btn btn-primary">Logout</button>

      </div>
    )
  }
}

export default  App 
