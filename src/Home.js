// dont delete /*global google*/ below or you will be done
/* global google */

// let จบลูปหาย - var ตรงกันข้าม
import React from 'react'
import { compose, withProps, lifecycle, withStateHandlers, withHandlers } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, Polyline, InfoWindow } from 'react-google-maps'
import { db } from './config/Fire'
import MapControl from './components/MapControl'
import Dock from './components/Dock'
import Modal from './components/Modal'

const _ = require('lodash')
const {
  DrawingManager
} = require('react-google-maps/lib/components/drawing/DrawingManager')
const {
  SearchBox
} = require('react-google-maps/lib/components/places/SearchBox')

const MapWithADrawingManager = compose(
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places',
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
    componentWillMount() {
    },

    componentDidMount() {
      const refs = {}
      let arrayOfShapes = []
      let overlayIndex = 0
      this.setState({
        markers: [], //for mark search position
        overlayState: [], //store overlay data
        planId: '', // plan Id for show on screen and use for save to firestore
        planName: '', //plan name for show on screen
        stateRedraw: [], //store overlay data that get from firestore
        polygonOptions: {
          strokeColor: '#ff751a',
          fillColor: '#ffc266',
        }, //option for overlay eg. strokeColor,fillColor, icon
        polylineOptions: {
          strokeColor: '#ff751a',
        }, //same as above
        markerOptions: {}, //same as above
        overlayRef: [],
        onOverlaySave: () => {

          var shapeId = this.state.planId
          console.log("id", shapeId)
          for (var key in arrayOfShapes) {
            var value = arrayOfShapes[key]
            console.log("value", value['overlayType'])
            // add coords array to cloud firestore
            db.collection('shapes').add({
              // add data here
              overlayCoords: value['overlayCoords'],
              overlayType: value['overlayType'],
              planId: value['planId'],
              overlayOptions: value['overlayOptions'],
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
          var overlayObject = overlay.overlay // get overlay object data
          var overlayType = overlay.type // get type of overlay
          var overlayCoords = []
          var planId = this.state.planId
          var zIndex = overlayIndex
          overlayIndex += 1

          //addListener to overlays
          this.state.addListenerOnOverlay(overlay)

          if (overlayType === 'polygon') {
            // loop for store LatLng to coords array
            this.state.onSquereMetersTrans(overlayObject)
            // push data that can save to firestore to object
            overlayObject.getPath().forEach(function (value) {
              overlayCoords.push({
                lat: value.lat(),
                lng: value.lng()
              })
            })
          }

          if (overlayType === 'polyline') {
            this.state.onPolylineLengthCompute(overlayObject)
            // push data that can save to firestore to object
            overlayObject.getPath().forEach(function (value) {
              overlayCoords.push({
                lat: value.lat(),
                lng: value.lng()
              })
            })
          }

          if (overlayType === 'marker') {
            // push data in to array
            overlayCoords.push({
              lat: overlayObject.getPosition().lat(),
              lng: overlayObject.getPosition().lng()
            })
          }

          var overlayOptions = {}
          if (overlayType === 'polygon') {
            overlayOptions = this.state.polygonOptions
          }
          if (overlayType === 'polyline') {
            overlayOptions = this.state.polylineOptions
          }

          var temp = []
          temp = this.state.overlayState
          temp.push({
            overlayType,
            overlayCoords,
            planId,
            overlayOptions,
            zIndex
          })
          this.setState({
            overlayState: temp
          }, () => console.log('#overlay in this overlayState ', this.state.overlayState))
        },
        onMapMounted: ref => {
          refs.map = ref
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref
        },
        onOverlayMount: ref => {
          refs.overlay = ref

          arrayOfShapes.push(ref)
          this.setState({
            overlayRef: arrayOfShapes
          }, () => console.log(this.state.overlayRef))

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

        onOverlayQuery: (planData) => {
          var self = this;
          var planName = planData['planName']['planName']
          var planId = planData['planId']
          var arr = []
          this.setState({
            planId: planId,
            planName: planName,

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

        addListenerOnOverlay: (overlay) => {
          var overlayObject = overlay.overlay // get overlay object data
          var overlayType = overlay.type // get type of overlay
          var index = overlayObject['zIndex'] //an index that identify overlay
          var indexForDelete = arrayOfShapes.findIndex(arrayOfShapes => arrayOfShapes.zIndex === index) //find index for use to delete from array

          if (overlayType === 'polygon') {
            google.maps.event.addListener(overlayObject, 'rightclick', function (event) {
              //ลบ polygon ออกจาก map โดยใช้ splice() ซึ่งจะเป็นการลบข้อมูลและจัดเรียงอาเรย์ให้ใหม่ โดยใช้ zindex ของตัว polygon เป็นตัวชี้
              arrayOfShapes.splice(indexForDelete, 1)
              overlayObject.getPath().clear()
              console.log(arrayOfShapes)
            });

            google.maps.event.addListener(overlayObject, 'click', function (event) {
              //ลบ polygon ออกจาก map โดยใช้ splice() ซึ่งจะเป็นการลบข้อมูลและจัดเรียงอาเรย์ให้ใหม่ โดยใช้ zindex ของตัว polygon เป็นตัวชี้
              console.log(arrayOfShapes)
            });
          }

          if (overlayType === 'polyline') {
            google.maps.event.addListener(overlayObject, 'rightclick', function (event) {
              //ลบ polygon ออกจาก map โดยใช้ splice() ซึ่งจะเป็นการลบข้อมูลและจัดเรียงอาเรย์ให้ใหม่ โดยใช้ zindex ของตัว polygon เป็นตัวชี้
              arrayOfShapes.splice(indexForDelete, 1)
              overlayObject.getPath().clear()
              console.log(arrayOfShapes)
            });
          }

          if (overlayType === 'marker') {
            google.maps.event.addListener(overlayObject, 'rightclick', function (event) {
              //ลบ polygon ออกจาก map โดยใช้ splice() ซึ่งจะเป็นการลบข้อมูลและจัดเรียงอาเรย์ให้ใหม่ โดยใช้ zindex ของตัว polygon เป็นตัวชี้
              arrayOfShapes.splice(indexForDelete, 1)
              overlayObject.setMap(null)
              console.log(arrayOfShapes, 'markerrr')
            });
          }

        },

        addListenerOnReDrawOverlay: (overlay) => {
          google.maps.event.addListener(overlay, 'click', function (event) {
            // //ลบ polygon ออกจาก map โดยใช้ splice() ซึ่งจะเป็นการลบข้อมูลและจัดเรียงอาเรย์ให้ใหม่ โดยใช้ zindex ของตัว polygon เป็นตัวชี้
            // arrayOfShapes.splice(indexForDelete, 1)
            // overlayObject.getPath().clear()
            console.log(overlay, 'from add')
          });
        },

        getGeoLocation: () => {
          navigator.geolocation.getCurrentPosition(position => {
            console.log(position.coords)
            this.setState({
              center: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }
            })
          })
        },
        onOverlayDeleteFromFirestore: (overlay) => {
          //delete data from firestore

          console.log(overlay, 'from delete')
          // db.collection("shapes").doc(overlayId).delete().then(function () {
          //   console.log("Document successfully deleted!");
          // }).catch(function (error) {
          //   console.error("Error removing document: ", error);
          // });
        },
      })
    } // end of Did M
  }), // end of lifeclycle
  withStateHandlers(() => ({
    isOpen: false,
  }), {
      onToggleOpen: ({ isOpen }) => () => ({
        isOpen: !isOpen,
      }),
      showInfo: ({ showInfo, isOpen }) => (a) => ({
        isOpen: !isOpen,
        showInfoIndex: a
      }),
    }),
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
    }}>

    <MapControl position={google.maps.ControlPosition.BOTTOM_CENTER}>
      <div>
        <button className='btn btn-info' onClick={props.onOverlaySave}>
          Save!
        </button>

        <button className='btn btn-info' onClick={props.getGeoLocation}>
          Find yourself!
        </button>
        <button className='btn btn-danger' disabled={true}>
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
    {props.stateRedraw.map(obj => { //redraw all overlay

      var overlayType = obj['overlayData']['overlayType']
      var overlayCoords = obj['overlayData']['overlayCoords']
      var overlayId = obj['overlayId']
      var overlayOptions = obj['overlayData']['overlayOptions']

      //redraw polygon
      if (overlayType === 'polygon') {
        return (
          <Polygon
            defaultOptions={overlayOptions}
            paths={overlayCoords}
            key={overlayId}
            zIndex={overlayId}
            ref={props.onOverlayMount}
            editable={true}
            onRightClick={() => {
              var selected = props.overlayRef.find(ref => (ref['_reactInternalFiber']['key'] === overlayId))
              console.log(selected)
              props.onOverlayDeleteFromFirestore(selected)

            }}

          />
        )
      }

      //redraw polyline
      if (overlayType === 'polyline') {
        return (
          <Polyline
            defaultOptions={overlayOptions}
            path={overlayCoords}
            key={overlayId}
            zIndex={overlayId}
            ref={props.onOverlayMount}
            onClick={() => {
              var ref = props.overlayRef
              ref.find(function (elem) {
                console.log(elem['_reactInternalFiber']['key'] = overlayId)
              })
            }}
          />
        )
      }
      //redraw marker
      if (overlayType === 'marker') {
        return (
          <Marker
            position={overlayCoords['0']} //marker need just an array of latlng
            key={overlayId}
            options={{ icon: 'https://i.imgur.com/9G5JOp8.png' }}
            onClick={() => { props.showInfo(overlayId) }}
            ref={props.onOverlayMount}
          >
            {(props.showInfoIndex === overlayId) && <InfoWindow onCloseClick={props.onToggleOpen}>
              <div>
                position is : {overlayCoords['0'].lat} ,  {overlayCoords['0'].lng}
              </div>
            </InfoWindow>}

          </Marker>
        )
      }
    })
    }


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
        markerOptions: {},
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
    {
      props.markers.map((marker, index) => (
        <Marker key={index} position={marker.position}
          animation={google.maps.Animation.BOUNCE}
        />
      ))
    }

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
