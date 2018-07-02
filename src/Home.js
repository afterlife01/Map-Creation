// dont delete /*global google*/ below or you will be done
/* global google */

// let จบลูปหาย - var ตรงกันข้าม
import React from 'react'
import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, Polyline } from 'react-google-maps'
import { db } from './config/Fire'
import MapControl from './components/MapControl'
import Dock from './components/Dock'
import Modal from './components/Modal'


var jpath =
  [
    { lat: 13.7739818, lng: 100.546488 },
    { lat: 13.5544, lng: 134.2465 },
    { lat: 13.7268122, lng: 100.5802612999 },
    { lat: 35.5396, lng: 134.2609 },
    { lat: 35.5460, lng: 134.2622 },
  ]
const _ = require('lodash')
const {
  DrawingManager
} = require('react-google-maps/lib/components/drawing/DrawingManager')
const {
  SearchBox
} = require('react-google-maps/lib/components/places/SearchBox')

const MapWithADrawingManager = compose(
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement:
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center'
      }} />,
    mapElement: <div style={{ height: `100%` }} />,
    center: { lat: 13.7739718, lng: 100.4852024 }
  }),
  lifecycle({
    componentDidMount() {
      const refs = {}
      let arrayOfShapes = []

      this.setState({
        markers: [], //for mark search position
        overlayState: [], //store overlay data
        planId: '', // plan Id for show on screen and use for save to firestore
        planName: '', //plan name for show on screen
        stateRedraw: [], //store overlay data that get from firestore
        polygonOptions: {
          strokeColor: '#ff751a',
          fillColor: '#ffc266',
          paths: jpath
        }, //option for overlay eg. strokeColor,fillColor, icon
        polylineOptions: {
          strokeColor: '#ff751a',
        }, //same as above
        markerOptions: {

        }, //same as above

        onOverlaySave: () => {
          this.setState(
            {
              overlayState: arrayOfShapes
            }, () => { console.log('click!', this.state.overlayState) })

          var shapeId = this.state.planId
          console.log("id", shapeId)
          for (var key in arrayOfShapes) {
            var value = arrayOfShapes[key]
            console.log("value", value['OverlayType'])
            // add coords array to cloud firestore
            db.collection('shapes').add({
              // add data here

              overlayCoords: value['OverlayCoords'],
              overlayType: value['OverlayType'],
              planId: value['planId'],
              overlayOptions: value['overlayOptions']

            }).catch(function (error) {
              console.error('Error writing document: ', error)
            });
          }
        },

        onSquereMetersTrans: polygon => {

          // คำนวนพื้นที่เป็นไร งาน ตารางวา - ต้องย้ายไปเป็นฟังก์ชั่นแยกต่างหาก
          var area = google.maps.geometry.spherical.computeArea(polygon.getPath())
          let rnwString = ''
          var rai, ngan, wa, temp1, temp2

          rai = Math.floor(area / 1600)
          temp1 = area % 1600
          ngan = Math.floor(temp1 / 400)
          temp2 = temp1 % 400
          wa = parseFloat((temp2 / 4).toFixed(3), 10)

          if (rai > 0) {
            rnwString = ''
            rnwString = rnwString + rai + ' ไร่ '
          }
          if (ngan > 0) {
            rnwString = rnwString + ngan + ' งาน '
          }
          if (wa > 0) {
            rnwString = rnwString + wa + ' ตารางวา '
          }
          else { rnwString = '0 ตารางวา' }

          return console.log('พื้นที่คือ ', rnwString)
        },
        onPolylineLengthCompute: polyline => {
          var length = google.maps.geometry.spherical.computeLength(polyline.getPath())
          return console.log('ความยาวรวม', length, 'เมตร')
        },

        //add finished overlay to arrayOfShapes
        onOverlayAdd: overlay => {
          var Overlay = overlay.overlay // get overlay object data
          var OverlayType = overlay.type // get type of overlay
          var OverlayCoords = []

          if (OverlayType === 'polygon') {
            // loop for store LatLng to coords array

            this.state.onSquereMetersTrans(Overlay)

            this.state.addListenerOnPolygon(Overlay)

            // push data that can save to firestore to object
            Overlay.getPath().forEach(function (value) {
              OverlayCoords.push({
                lat: value.lat(),
                lng: value.lng()
              })
            })
          }

          if (OverlayType === 'polyline') {
            this.state.onPolylineLengthCompute(Overlay)
            // push data that can save to firestore to object
            Overlay.getPath().forEach(function (value) {
              OverlayCoords.push({
                lat: value.lat(),
                lng: value.lng()
              })
            })
          }

          if (OverlayType === 'marker') {
            // push data in to array
            OverlayCoords.push({
              lat: Overlay.getPosition().lat(),
              lng: Overlay.getPosition().lng()
            })
          }
          var overlayOptions = {}
          if (OverlayType === 'polygon') {
            overlayOptions = this.state.polygonOptions
          }
          if (OverlayType === 'polyline') {
            overlayOptions = this.state.polylineOptions
          }

          arrayOfShapes.push({
            OverlayType,
            OverlayCoords,
            planId: this.state.planId,
            overlayOptions
          })
          this.setState({
            overlayState: arrayOfShapes
          }, () => console.log('#overlay in this arr ', this.state.overlayState))

        },

        onMapMounted: ref => {
          refs.map = ref
        },

        onSearchBoxMounted: ref => {
          refs.searchBox = ref
        },

        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces()
          const bounds = new google.maps.LatLngBounds()
          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          })
          const nextMarkers = places.map(place => ({
            position: place.geometry.location
          }))
          const nextCenter = _.get(nextMarkers, '0.position', this.props.center)

          this.setState({
            center: nextCenter,
            markers: nextMarkers
          })
        },

        getGeoLocation: () => {
          navigator.geolocation.getCurrentPosition(position => {
            console.log(position.coords)
            this.setState({
              center: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            })
          })
        },

        onOverlayQuery: (planData) => {
          var self = this;
          var planName = planData['planName']['planName']
          var planId = planData['planId']
          let arr = []

          this.setState({
            planId: planId,
            planName: planName
          })

          db.collection('shapes').where('planId', '==', planId).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              arr.push({
                overlayData: doc.data(),
                overlayId: doc.id
              })
            })
            console.log("user for create overlay", arr, planId)
            self.setState({
              stateRedraw: arr
            })
          })

        },

        addListenerOnPolygon: (polygon) => {
          google.maps.event.addListener(polygon, 'click', function (event) {
            console.log(polygon.getPath().clear());
          });
        }
      })
    } // end of Did M
  }), // end of lifeclycle
  withScriptjs, // end of withScriptjs
  withGoogleMap // end of withGoogleMap
)(props => (
  <GoogleMap
    ref={props.onMapMounted}
    center={props.center}
    defaultZoom={17}
    defaultMapTypeId={'satellite'}
    defaultOptions={{
      fullscreenControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      }
    }}
  >
    <Polygon



    />
    <MapControl position={google.maps.ControlPosition.BOTTOM_CENTER}>
      <div>
        <button className='btn btn-info' onClick={props.onOverlaySave}>
          Save!
        </button>

        <button className='btn btn-info' onClick={props.getGeoLocation}>
          Find yourself!
        </button>
        <button className='btn btn-danger' >
          My name is {props.planName}
        </button>
        <Modal />
      </div>
    </MapControl>

    <MapControl position={google.maps.ControlPosition.TOP_RIGHT}>
      <Dock
        onOverlayQuery={props.onOverlayQuery}
      />
    </MapControl>


    {props.stateRedraw.map(value => { //redraw all overlay

      var overlayType = value['overlayData']['overlayType']
      var overlayCoords = value['overlayData']['overlayCoords']
      var overlayId = value['overlayId']

      //redraw polygon
      if (overlayType === 'polygon') {

        return (
          <Polygon

            paths={overlayCoords}
            key={overlayId}

          />
        )
      }

      //redraw polyline
      if (overlayType === 'polyline') {
        return (
          <Polyline

            path={overlayCoords}
            key={overlayId}
          />)
      }
      //redraw marker
      if (overlayType === 'marker') {
        return (
          <Marker

            position={overlayCoords['0']} //marker need just an array of latlng
            key={overlayId}
          />)

      }

    })}

    <DrawingManager
      onOverlayComplete={overlay => {
        props.onOverlayAdd(overlay)
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
          ]
        },
        polygonOptions: props.polygonOptions,
        polylineOptions: props.polylineOptions,
        markerOptions: {
          animation: google.maps.Animation.DROP,
        },
      }}
    />
    <SearchBox
      ref={props.onSearchBoxMounted}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type='text'
        placeholder='ค้นหาสถานที่...'
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
    {props.markers.map((marker, index) => (
      <Marker key={index} position={marker.position}
        animation={google.maps.Animation.BOUNCE}
      />
    ))}

  </GoogleMap>
))

export default class App extends React.PureComponent {
  render() {
    return (
      <div>
        <MapWithADrawingManager />
      </div>
    )
  }
}
