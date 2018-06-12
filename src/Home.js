/*global google*/
import React from "react"
import { compose, withProps} from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap} from "react-google-maps"
import firebase from './config/Fire';


const overlaysRef = firebase.database().ref('overlays');
const { DrawingManager } = require("react-google-maps/lib/components/drawing/DrawingManager");
const MapWithADrawingManager = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `675px`}} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
)(props =>
  <GoogleMap
    defaultZoom={17}
    defaultCenter={{ lat: 13.652383, lng: 100.493872 }}
    
  >
  
  <DrawingManager
      
      onPolygonComplete={polygon => {

        var myMvcArray = google.maps.MVCArray();
        polygon.setPaths(myMvcArray);
        polygon.getPaths();
        
        //myMvcArray = polygon.getPaths();
        console.log(myMvcArray.getArray());
        
       //overlaysRef.push(myMvcArray)
      }}

      onPolylineComplete={polyline => {
        overlaysRef.push(polyline.getPath().getArray())
        console.log(polyline.getPath().getArray())
      }}

      onRectangleComplete={rectangle => {
        console.log(rectangle.getBounds())
        overlaysRef.push(rectangle.getBounds())
      }}

      onMarkerComplete={marker =>{
        console.log(marker.getPosition())
        //overlaysRef.push(marker.getPosition())
      }}

      onCircleComplete={circle => {
        console.log(circle.getBounds())
        overlaysRef.push(circle.getBounds())
      }}

      defaultOptions={{
        
        drawingControl: true,
        drawingControlOptions: {style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.POLYLINE,
            google.maps.drawing.OverlayType.RECTANGLE,
            google.maps.drawing.OverlayType.MARKER,
            google.maps.drawing.OverlayType.CIRCLE,
            
          ],
        },
        rectangleOptions:{
          fillColor : '#BCDCF9',

        },
        circleOptions:{
          fillColor : '#BCDCF9',

        },
        polygonOptions:{
          fillColor : '#BCDCF9',
          
        },
        polylineOptions:{
          
        }
      } 
    
    }
    
     />
  </GoogleMap>
);

export default class App extends React.PureComponent {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    
}

saveMap(){

}

logout() {
    firebase.auth().signOut();
    this.setState({user: null});
}

  render() {


    return (

      <div>
        <h2>Map Creation</h2><br/>
        <MapWithADrawingManager /><br/><br/>
        <button onClick = {this.Clear}  className="btn btn-success">Save Map</button>
        <button onClick = {this.logout} style={{marginLeft: '25px'}} className="btn btn-primary">Logout</button>
        
      </div>
    )
  }
}
