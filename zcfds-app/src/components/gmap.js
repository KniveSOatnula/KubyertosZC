import React, { Component } from 'react';
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import {GET_POSITION, CREATE_POSITION} from '../queries';
import {withApollo} from 'react-apollo';
import {withRouter} from 'react-router-dom';

const MyMapComponent = compose(
	withProps({
		googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBGLAAvf0Fn1iwBMgCBbOZp678MGWZpD-E&v=3.exp&libraries=geometry,drawing,places",
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: <div style={{ height: `400px` }} />,
		mapElement: <div style={{ height: `100%` }} />,
	}),
	withScriptjs,
	withGoogleMap
	)((props) =>
	<GoogleMap
		defaultZoom={8}
		defaultCenter={{ lat: props.lat, lng: props.lng }}
	>
		{props.children}
	</GoogleMap>
)


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
		if(localStorage.getItem('userType') === 'CLIENT') {
			let { data: {getPosition} } = await client.query({query: GET_POSITION, variables: {userId: match.params.id}});
			this.setState({
				lat: getPosition.latitude,
				lng: getPosition.longitude
			})
			setInterval(async () => {
				let { data: {getPosition} } = await client.query({query: GET_POSITION, variables: {userId: match.params.id}});
				that.setState({
					lat: getPosition.latitude,
					lng: getPosition.longitude
				})
			}, 60 * 1000);
		}
		this.getCurrentLocation();
	}

	getCurrentLocation() {
		const { client } = this.props;
		let createPosition = async (latitude, longitude) => {
			await client.mutate({mutation: CREATE_POSITION, variables: {latitude, longitude}});
		}
		if ("geolocation" in navigator) {
			let that = this;
			var options = {
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0
			};
			navigator.geolocation.getCurrentPosition(function(position) {
				that.setState({lat2: position.coords.latitude, lng2: position.coords.longitude})
				if(localStorage.getItem('userType') === 'DELIVERY_PERSONNEL') {
					createPosition(position.coords.latitude, position.coords.longitude);
				}
			}, null, options);
			setInterval(() => {
				navigator.geolocation.getCurrentPosition((position) => {
					that.setState({lat2: position.coords.latitude, lng2: position.coords.longitude})
					if(localStorage.getItem('userType') === 'DELIVERY_PERSONNEL') {
						createPosition(position.coords.latitude, position.coords.longitude);
					}
				}, null, options);
			}, 60 * 1000);
		} else {
			alert('Geolocation not supported.');
		}
	}

	render() {
		const position = {lat: this.state.lat2, lng: this.state.lng2};
		console.log({position});
		return (<MyMapComponent lat={this.state.lat2} lng={this.state.lng2}>
			{this.state.lat !== 0 && <Marker position={{lat:this.state.lat, lng:this.state.lng}}/>}
			{this.state.lat2 !== 0 && <Marker position={position}/>}
		</MyMapComponent>
		)
	}
}

export default withApollo(withRouter(SimpleMap));