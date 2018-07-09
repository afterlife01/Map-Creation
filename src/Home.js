// dont delete /*global google*/ below or you will be fired
/* global google */

import React from 'react'
import { compose, withProps, lifecycle, withStateHandlers, } from 'recompose'
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

  }),
  lifecycle({

    componentDidMount() {
      const refs = {}
      let overlayIndex = 0
      let oRef = []
      this.setState({
        markers: [], //for mark search position
        overlayState: [], //store overlay data
        planData: [],
        polygonOptions: {
          strokeColor: '#ff751a',
          fillColor: '#ffc266',
        }, //option for overlay eg. strokeColor,fillColor, icon
        polylineOptions: {
          strokeColor: '#ff751a',
          strokeWeight: '7'
        }, //same as above
        markerOptions: {
        }, //same as above
        overlayRef: [],
        selectedOverlay: [],
        overlayRedraw: [],
        visible: true,
        rfill: '#123abc',
        isMarkerShow: false,
        zoom: 15,
        onOverlaySave: () => {

          let arrayOfShapes = []
          arrayOfShapes = this.state.overlayState
          if (arrayOfShapes.length > 0) {

            for (var key in arrayOfShapes) {

              var value = arrayOfShapes[key]
              // add coords array to cloud firestore
              db.collection('shapes').add({
                // add data here
                overlayCoords: value['overlayCoords'],
                overlayType: value['overlayType'],
                planId: value['planId'],
                overlayOptions: value['overlayOptions'],
              }).then(
                console.log("notice me pempai!")
              )
            }
          } else {
            alert('Nothing to save!')
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
          var planId = this.state.planData.planId
          var zIndex = overlayIndex
          overlayIndex += 1
          var arrayOfShapes = []
          arrayOfShapes = this.state.overlayState

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
          arrayOfShapes.push({
            overlayType,
            overlayCoords,
            planId,
            overlayOptions,
            zIndex,
          })

          this.setState({
            overlayState: arrayOfShapes
          }, () => console.log('#overlay in this overlayState ', this.state.overlayState))
        },
        onMapMounted: ref => {
          refs.map = ref
          var t = refs.map
          this.setState({
            mapRef: t
          })
          this.state.getGeoLocation()
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref
        },
        onOverlayMount: ref => {
          refs.overlay = ref
          oRef.push(refs.overlay)
          this.setState({
            overlayRef: oRef
          }, () => console.log(this.state.overlayRef, 'overlayRef from onOverlayMount'))
        },
        onDrawingManagerMount: ref => {
          refs.drawingManager = ref
          var t = refs.drawingManager
          this.setState({
            drawingManagerRef: t
          })

        },
        setSelectOverlay: (overlay, drawMode) => {
          this.setState({
            selectedOverlay: overlay,
            drawMode: drawMode
          }, () => console.log(this.state.selectedOverlay, 'selected'))
        },
        resetSelectOverlay: () => {
          this.setState({
            selectedOverlay: [],
            drawMode: ''
          })
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces()
          console.log(_, 'places')
          const bounds = new google.maps.LatLngBounds()
          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          })
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }))
          const nextCenter = _.get(nextMarkers, '0.position', this.props.center)

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
            isMarkerShow: true
          }, () => console.log(nextCenter, 'next cen'),
            console.log(nextMarkers[0]['position'], 'nextmark'))
        },

        onOverlayQuery: (planData) => {
          var planName
          var planId
          let self = this
          let arrayOfShapes = []
          this.setState({
            planData: planData
          }, () => {
            planName = this.state.planData.planName.planName
            planId = this.state.planData.planId
            db.collection('shapes').where('planId', '==', planId).get().then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                arrayOfShapes.push({
                  overlayData: doc.data(),
                  overlayId: doc.id
                })
              })
              self.setState({
                overlayRedraw: arrayOfShapes
              }, () => {
                console.log(self.state.overlayRedraw, 'overlay state for redraw')
                self.state.onFitBounds(arrayOfShapes)
              })
            })
          })
        },
        readRef: () => {
          console.log(this.state.mapRef)
          console.log(this.state.drawingManagerRef)
        },
        addListenerOnOverlay: (overlay) => {
          var self = this
          var overlayObject = overlay.overlay // get overlay object data

          google.maps.event.addListener(overlayObject, 'click', function (event) {
            self.state.setSelectOverlay(overlayObject, 'tool')
          })

          if (overlay.type === 'polygon') {

            google.maps.event.addListener(overlayObject, 'rightclick', function (event) {
              overlayObject.setOptions({
                fillColor: '#f25511'
              })
            })
          }
        },
        getGeoLocation: () => {
          navigator.geolocation.getCurrentPosition(position => {
            console.log(position.coords)
            this.setState({
              center: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              isMarkerShow: true
            }, () => {
              if (this.state.zoom < 18) {
                this.setState({
                  zoom: 18
                })
              }
            })
          })
        },
        delayMarker: () => {
          setTimeout(() => {
            this.setState({
              isMarkerShow: false
            })
          }, 1000);
        },
        onZoomChanged: () => {
          this.setState({ zoom: this.state.mapRef.getZoom() })
        },
        onDeleteButton: () => {
          var selectedOverlay = this.state.selectedOverlay
          var drawMode = this.state.drawMode

          if (selectedOverlay.length === 0) {
            alert('ช้าก่อนไอ้สอง เลือกรูปก่อน!')
          } else {

            if (drawMode === 'tool') {
              var arrayOfShapes = this.state.overlayState
              var index = selectedOverlay['zIndex'] //an index that identify overlay
              var indexForDelete = arrayOfShapes.findIndex(arrayOfShapes => arrayOfShapes.zIndex === index) //find index for use to delete from array
              arrayOfShapes.splice(indexForDelete, 1)
              selectedOverlay.setMap(null)
              console.log(arrayOfShapes, 'deleted')
            }
            if (drawMode === 'redraw') {
              let ref = this.state.overlayRef
              let index = ref.findIndex(ref => (ref['_reactInternalFiber']['key'] === selectedOverlay['_reactInternalFiber']['key']))
              var overlayId = selectedOverlay['_reactInternalFiber']['key']
              db.collection("shapes").doc(overlayId).delete().then(function () {
                console.log("Document successfully deleted!");
              }).catch(function (error) {
                console.error("Error removing document: ", error);
              });

              if (selectedOverlay.props.type === 'polygon') {
                ref.splice(index, 1)
                selectedOverlay.getPath().clear()
              }
              if (selectedOverlay.props.type === 'polyline') {
                ref.splice(index, 1)
                selectedOverlay.getPath().clear()
              }
              if (selectedOverlay.props.type === 'marker') {
                console.log(selectedOverlay, 'pm')
                this.setState({
                  visible: false
                })
              }

              console.log(ref)
            }
          }
          this.state.resetSelectOverlay()
        },
        onFillCorlorChange: () => {
          this.setState({ rfill: '#ffaa13' })
        },
        onFitBounds: (arrayOfShapes) => {
          const bounds = new window.google.maps.LatLngBounds();

          arrayOfShapes.forEach(value => {
            value.overlayData.overlayCoords.forEach(value2 => {
              bounds.extend(new window.google.maps.LatLng(value2))
            })
          })
          this.state.mapRef.fitBounds(bounds)
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
    onClick={props.resetSelectOverlay}
    center={props.center}
    zoom={props.zoom}
    onZoomChanged={props.onZoomChanged}
    defaultMapTypeId={'satellite'}
    defaultOptions={{
      fullscreenControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      }
    }}>
    {
      props.isMarkerShow && <Marker
        position={props.center}
        animation={google.maps.Animation.BOUNCE}
        onMouseOver={props.delayMarker}
      />
    }
    <MapControl position={google.maps.ControlPosition.BOTTOM_CENTER}>
      <div>
        <button className='btn btn-info' onClick={props.onOverlaySave}>
          Save!
        </button>

        <button className='btn btn-info' onClick={props.getGeoLocation}>
          Find yourself!
        </button>
        <button className='btn btn-danger' onClick={props.readRef}>
          My name is {props.planData.planName}
        </button>
        <Modal />
      </div>
    </MapControl>

    <MapControl position={google.maps.ControlPosition.TOP_RIGHT}>
      <Dock
        onOverlayQuery={props.onOverlayQuery}
      />
    </MapControl>

    <MapControl position={google.maps.ControlPosition.LEFT_CENTER}>
      <button className="btn btn-warning"
        onClick={props.onDeleteButton}
      >
        DELETE!
      </button>
    </MapControl>

    {props.overlayRedraw.map(obj => { //redraw all overlay
      let t = props.rfill

      let overlayType = obj['overlayData']['overlayType']
      let overlayCoords = obj['overlayData']['overlayCoords']
      let overlayId = obj['overlayId']
      let overlayOptions = obj['overlayData']['overlayOptions']
      //redraw polygon
      if (overlayType === 'polygon') {
        return (
          <Polygon
            options={{
              fillColor: t
            }}
            paths={overlayCoords}

            key={overlayId}
            zIndex={overlayId}
            ref={props.onOverlayMount}
            type={'polygon'}

            onClick={() => {
              let ref = props.overlayRef
              let index = ref.findIndex(ref => (ref['_reactInternalFiber']['key'] === overlayId))
              let polygon = ref[index]
              props.setSelectOverlay(polygon, 'redraw')
            }}
            onRightClick={() => {
              props.onFillCorlorChange()
            }}
          />
        )
      }
      //redraw polyline
      if (overlayType === 'polyline') {
        return (
          <Polyline
            defaultOptions={{
              overlayOptions,
              opacity: '10'
            }}
            path={overlayCoords}
            key={overlayId}
            zIndex={overlayId}
            ref={props.onOverlayMount}
            type={'polyline'}
            onClick={() => {
              let ref = props.overlayRef
              let index = ref.findIndex(ref => (ref['_reactInternalFiber']['key'] === overlayId))
              let polyline = ref[index]
              props.setSelectOverlay(polyline, 'redraw')
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
            visible={props.visible}
            options={{ icon: 'https://i.imgur.com/9G5JOp8.png' }}
            type={'marker'}
            onClick={() => {
              props.showInfo(overlayId)
              let ref = props.overlayRef
              let index = ref.findIndex(ref => (ref['_reactInternalFiber']['key'] === overlayId))
              let marker = ref[index]
              props.setSelectOverlay(marker, 'redraw')
            }}
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
      ref={props.onDrawingManagerMount}
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
        props.isMarkerShow && <Marker
          onMouseOver={props.delayMarker}
          key={index} position={marker.position}
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
