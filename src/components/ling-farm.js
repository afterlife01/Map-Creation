//DO NOT DELETE /*global google*/ BELOW OR YOU WILL BE FIRED!
/* global google */
{
/*

}
import React, { Component , PropsType } from 'react';
import GoogleMap from 'google-map-react';
import MapControl from '../components/MapControl'
import Dock from '../components/Dock'
//import shouldPureComponentUpdate from 'react-pure-render/function';
import shouldPureComponentUpdate from 'react-pure-render-utils/function';



function createMapOptions(maps) {
    // next props are exposed at maps
    // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
    // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
    // "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
    // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
    // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
    return {
        zoomControlOptions: {
            position: maps.ControlPosition.RIGHT_CENTER,
            style: maps.ZoomControlStyle.SMALL
        },
        mapTypeControlOptions: {
            position: maps.ControlPosition.TOP_RIGHT
        },
        mapTypeControl: true
    };
}

export default class SimpleMap extends Component {
    static propTypes = {
        center: PropTypes.array,
        zoom: PropTypes.number,
        greatPlaceCoords: PropTypes.any
    };

    static defaultProps = {
        center: [59.938043, 30.337157],
        zoom: 9,
        greatPlaceCoords: { lat: 59.724465, lng: 30.080121 }
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <GoogleMap
                // apiKey={YOUR_GOOGLE_MAP_API_KEY} // set if you need stats etc ...
                center={this.props.center}
                zoom={this.props.zoom}
                options={createMapOptions}>

            </GoogleMap>
        );
    }
}
*/}