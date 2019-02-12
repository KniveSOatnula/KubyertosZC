import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import HomeIcon from '../images/baseline-home-24px.svg';
import MotorcycleIcon from '../images/baseline-motorcycle-24px.svg';
import L from 'leaflet';
import {GET_POSITION} from '../queries';
import {withApollo} from 'react-apollo';
import {withRouter} from 'react-router-dom';

const iconHome = new L.Icon({
	iconUrl: HomeIcon,
	iconRetinaUrl: HomeIcon,
	iconAnchor: null,
	popupAnchor: null,
	shadowUrl: null,
	shadowSize: null,
	shadowAnchor: null,
	iconSize: new L.Point(24, 24),
	className: 'leaflet-div-icon'
});

const iconMotorcycle = new L.Icon({
	iconUrl: MotorcycleIcon,
	iconRetinaUrl: MotorcycleIcon,
	iconAnchor: null,
	popupAnchor: null,
	shadowUrl: null,
	shadowSize: null,
	shadowAnchor: null,
	iconSize: new L.Point(24, 24),
	className: 'leaflet-div-icon'
});

class SimpleMap extends Component {

	state = {
		lat: 0,
		lng: 0,
		zoom: 13,
		lat2: 0,
		lng2: 0
	}

	async componentDidMount() {
		const { client, match } = this.props;
		let that = this;
		let { data: {getPosition} } = await client.query({query: GET_POSITION, variables: {userId: match.params.id}});
		this.setState({
			lat: getPosition.latitude,
			lng: getPosition.longitude
		})
		console.log({getPosition})
		setInterval(async () => {
			let { data: {getPosition} } = await client.query({query: GET_POSITION, variables: {userId: match.params.id}});
			that.setState({
				lat: getPosition.latitude,
				lng: getPosition.longitude
			})
		}, 60 * 1000);
		this.getCurrentLocation();
	}

	getCurrentLocation() {
		if ("geolocation" in navigator) {
			let that = this;
			var options = {
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0
			};
			navigator.geolocation.getCurrentPosition(function(position) {
				that.setState({lat2: position.coords.latitude, lng2: position.coords.longitude})
			}, null, options);
			setInterval(() => {
				navigator.geolocation.getCurrentPosition((position) => {
					that.setState({lat2: position.coords.latitude, lng2: position.coords.longitude})
				}, null, options);
			}, 60 * 1000);
		} else {
			alert('Geolocation not supported.');
		}
	}

	render() {
		const position = [this.state.lat2, this.state.lng2]
		return (<Map style={{height:400}} center={position} zoom={this.state.zoom}>
			<TileLayer
			attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{this.state.lat !== 0 && <Marker position={[this.state.lat, this.state.lng]} icon={iconMotorcycle}>
			</Marker>}
			{this.state.lat2 !== 0 && <Marker position={position} 
				icon={localStorage.getItem('userType') === 'DELIVERY_PERSONNEL' ? iconMotorcycle: iconHome}></Marker>}
			</Map>
		)
	}
}

export default withApollo(withRouter(SimpleMap));