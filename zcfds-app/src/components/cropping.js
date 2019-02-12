import React, { Component } from 'react';
import {Grid, Dialog, Slide, AppBar, Button, Toolbar, Typography, IconButton, withStyles} from '@material-ui/core';
import {Slider} from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';

const styles = {
	appBar: {
	  position: 'relative',
	},
	flex: {
	  flex: 1,
	},
	slider: {
		padding: '22px 0px',
	},
	container: {
		width: '320px',
		height: '320px',
		margin: '0 auto'
	},
	subcontainer1: {
		boxShadow: '0 0 2px rgba(255, 255, 255, .5)',
		overflow: 'hidden',
		position: 'relative',
		height: '320px',
		width: '320px',
	},
	img1: {
		position: 'absolute',
		height: '320px',
	},
	subcontainer2: {
		position: 'absolute',
		height: '320px',
		width: '320px',
		top: 0
	},
	img2: {
		cursor: 'move',
		opacity: '.3',
		position: 'absolute',
		height: '320px',
	}
}

function Transition(props) {
	return <Slide direction="up" {...props} />;
}

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			left: 0,
			top: 0,
			zoom: 100
		}
		this.dragging = false;
		this.imgWidth = 0;
		this.imgHeight = 320;
		this.x = 0;
		this.y = 0;
		this.canvas = React.createRef();
		this.img = React.createRef();
		this.download = React.createRef();
	}

	componentDidMount() {
		//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob#Polyfill
		if (!HTMLCanvasElement.prototype.toBlob) {
			Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
				value: function (callback, type, quality) {
				var canvas = this;
				setTimeout(function() {
					var binStr = atob( canvas.toDataURL(type, quality).split(',')[1] ),
						len = binStr.length,
						arr = new Uint8Array(len);
					for (var i = 0; i < len; i++ ) {
					arr[i] = binStr.charCodeAt(i);
					}
					callback( new Blob( [arr], {type: type || 'image/png'} ) );
				});
				}
			});
		}
	}

	handleClose = () => {
		this.props.handleClose(this.props.file);
	};

	getImgWidth = () => {
		return this.imgWidth === 0 ? 'auto': this.imgWidth * (this.state.zoom/100);
	}

	getImgHeight = () => {
		return this.imgHeight * (this.state.zoom/100);
	}

	onImgLoad = ({target}) => {
		this.imgWidth = target.offsetWidth;
		this.imgHeight = target.offsetHeight;
		this.setState({
			left: (this.imgWidth/2 - 320/2) * -1,
			top: (this.imgHeight/2 - 320/2) * -1
		});
	}

	onMouseDown = (event) => {
		this.dragging = true;
		this.x = event.clientX;
		this.y = event.clientY;
	}

	onMouseUp = () => {
		this.dragging = false;
	}

	onMouseLeave = (event) => {
		this.dragging = false;
	}

	onMouseMove = (event) => {
		if(this.dragging) {
			var x = (this.x - event.clientX) * -1;
			var y = (this.y - event.clientY) * -1;
			this.x = event.clientX;
			this.y = event.clientY;
			let left = this.state.left + x;
			let top = this.state.top + y;
			if(left <= 0 && left >= (this.getImgWidth() - 320) * -1) {
				this.setState((prevState, props) => ({
					left: prevState.left + x,
				}));
			}
			if(top <= 0 && top >= (this.getImgHeight() - 320) * -1) {
				this.setState((prevState, props) => ({
					top: prevState.top + y,
				}));
			}
		}
	}

	handleZoomChange = (event, value) => {
		this.setState((prevState, props) => ({
			zoom: value
		}));
	}

	handleInputChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	draw = () => {
		let size = this.img.current.naturalWidth;
		if(this.img.current.naturalHeight < size) {
			size = this.img.current.naturalHeight;
		}
		this.canvas.current.width = size;
		this.canvas.current.height = size;
		let ctx = this.canvas.current.getContext("2d");
		let dx = Math.abs(this.state.left) * (this.img.current.naturalWidth/this.img.current.clientWidth);
		let dy = Math.abs(this.state.top) * (this.img.current.naturalHeight/this.img.current.clientHeight);
		let dWidth = size;
		let dHeight = size;
		let sx = 0;
		let sy = 0;
		let sWidth = size * (this.state.zoom/100);
		let sHeight = size * (this.state.zoom/100);
		ctx.clearRect(0, 0,this.canvas.current.width, this.canvas.current.height);
		ctx.drawImage(this.img.current, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight);
	}

	crop = () => {
		this.draw();
		this.canvas.current.toBlob((blob) => {
			let file = new File([blob], 'profile.png', {
				type: "image/png"
			});
			this.props.handleClose(file);
		});
		this.setState({zoom: 100, top: 0, left: 0})
	}

	render() {
		let w = this.getImgWidth();
		let h = this.getImgHeight();
		let dimen = {
			left: this.state.left,
			top: this.state.top,
			width: w,
			height: h
		}
		const {classes, src} = this.props;
		return (
			<Dialog
				fullScreen
				open={true}
				TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
				<Toolbar>
					<IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
					<CloseIcon />
					</IconButton>
					<Typography variant="h6" color="inherit" className={classes.flex}>
						Edit Photo
					</Typography>
					<Button color="inherit" onClick={this.crop}>Save
					</Button>
				</Toolbar>
				</AppBar>
				<div style={{height: 400, overflow: 'hidden', position: 'relative'}}>
					<div style={styles.container}>
						<div style={styles.subcontainer1}>
							<img alt="" onLoad={this.onImgLoad} style={{...styles.img1, ...dimen}} src={src} draggable={false} ref={this.img}/>
						</div>
						<div style={styles.subcontainer2}>
							<img alt="" style={{...styles.img2, ...dimen}} src={src} draggable={false}
								onMouseDown={this.onMouseDown}
								onMouseUp={this.onMouseUp}
								onMouseMove={this.onMouseMove}
								onMouseLeave={this.onMouseLeave}
							/>
						</div>
					</div>
				</div>
				<Grid container alignContent="flex-start" justify="center">
					<div style={{width: 300}}>
						<Slider
							classes={{ container: classes.slider }}
							value={this.state.zoom}
							aria-labelledby="label"
							onChange={this.handleZoomChange}
							min={100}
							max={500}
						/>
					</div>
				</Grid>
				<canvas ref={this.canvas} hidden={true}></canvas>
			</Dialog>
		);
	}
}

export default withStyles(styles)(App);
