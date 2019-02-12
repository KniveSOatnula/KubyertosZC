import React from 'react';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import {AppBar, Tabs, Tab, Typography, Paper, Grid, Divider, Button, Badge, FormControl, InputLabel, Select, MenuItem, OutlinedInput} from '@material-ui/core';
import { Query, Mutation } from "react-apollo";
import { ORDERS, ACCEPT_ORDER, ORDER_PREPARED, ORDER_PICKED_UP, ORDER_DELIVERED, CANCEL_ORDER, CREATE_POSITION, MY_PERSONNELS} from '../queries';
import FoodIcon from '@material-ui/icons/FastfoodOutlined';
import moment from 'moment';
import {withRouter} from 'react-router-dom';
import {withApollo} from 'react-apollo';
import {withSnackbar} from 'notistack';

function TabContainer({ children, dir }) {
	return (
		<Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
		{children}
		</Typography>
	);
}


const styles = theme => ({
	root: {
		backgroundColor: theme.palette.background.paper,
		margin: 32
	},
	leftIcon: {
		marginRight: theme.spacing.unit,
	},
	margin: {
		margin: theme.spacing.unit * 2,
	},
});

class Order extends React.Component {
	state = {
		open: false,
	};

	handleTooltipClose = () => {
		this.setState({ open: false });
	};

	handleTooltipOpen = () => {
		this.setState({ open: true });
	};
	render() {
		const {o, actions, details} = this.props;
		return <Paper style={{marginBottom: 16}}>
		<Grid container justify="space-between" alignItems="center" style={{padding: 16}}>
			<Grid item>
				{details}
			</Grid>
			<Grid item>
				<Grid container alignItems="center">
				<Grid item> 
					<Typography component="span">{moment(o.updatedAt).local().format('MMM DD YYYY, h:mm a')} |</Typography>
				</Grid>
				<Grid item>
					<Typography component="span" color="secondary">{o.status}</Typography>
				</Grid>
				</Grid>
			</Grid>
		</Grid>
		<Divider/>
		{
			o.items.map((i, key) => (<div key={key}>
				<Grid container justify="space-between" alignItems="center" style={{padding: 24}}>
				<Grid item>
					<Grid container alignItems="center">
					<img alt="" src={i.thumbnail.url} style={{width: 50, height: 50}} />
					<div style={{marginLeft: 32}}><Typography variant="h6">{i.name}</Typography>
					<Typography color="textSecondary" component="div">{i.description}</Typography>
					<Typography color="textPrimary" component="div">x {i.quantity}</Typography></div>
					</Grid>
				</Grid>
				<Grid item>
					<Typography style={{display: 'inline-block'}} color="textSecondary">₱ {i.price/100}</Typography>
				</Grid>
				</Grid>
				<Divider/>
				</div>
			))
		}
		<Grid container justify="space-between" alignItems="center" style={{padding: '32px 16px 16px 16px'}}>
			<Grid item>
				{o.deliveryPersonnel &&  <Typography variant="subtitle2" color="textSecondary">Delivery Personnel</Typography> }
				{o.deliveryPersonnel &&  <Typography variant="subtitle2" color="textPrimary">{o.deliveryPersonnel.firstname} {o.deliveryPersonnel.lastname} {o.deliveryPersonnel.plateNumber} </Typography> }
			</Grid>
			<Grid item>
				<Typography style={{display: 'inline-block'}} variant="subtitle2" color="textPrimary">Order Total: </Typography>
				<Typography style={{display: 'inline-block'}} variant="h4" color="secondary">₱ {o.items.reduce((sum, o) => sum + o.price * o.quantity, 0)/100}</Typography>
			</Grid>
		</Grid>
		{actions}
	</Paper>
	}
}

class PrepareOrder extends React.Component {

	state = {
		personnel: "",
		labelWidth: 0
	}

	componentDidMount() {
		this.setState({
			labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
		});
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	render() {
		const {o, history, classes} = this.props;
		const userType = localStorage.getItem('userType');
		return <Order key={o.id} o={o}
		actions={<Grid container justify="flex-end" alignItems="flex-end" style={{padding: '0 16px 16px 16px'}} spacing={8}>
				<Grid item style={{display: userType === 'RESTAURANT' ? 'initial': 'none'}}>
					<FormControl style={{minWidth: 180}}>
					<InputLabel shrink
					ref={ref => {
						this.InputLabelRef = ref;
					}}
					htmlFor="outlined-simple"
					>
					Choose Personnel
					</InputLabel>
					<Query query={MY_PERSONNELS}>
						{({ loading, error, data }) => {
								if (loading) return '';
								if (error) return '';
								return <Select
									displayEmpty
									input={
										<OutlinedInput
											labelWidth={this.state.labelWidth}
											id="outlined-simple"
										/>}
									value={this.state.personnel}
									onChange={this.handleChange('personnel')}>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									{data.mypersonnels.map(o => (
										<MenuItem key={o.id} value={o.id}>{o.firstname} {o.lastname}</MenuItem>
									))}
								</Select>
						}}
					</Query>
					</FormControl>
				</Grid>
				<Grid item style={{display: userType === 'RESTAURANT' ? 'initial': 'none'}}>
					<Mutation mutation={ORDER_PREPARED}>
					{(orderPrepared, { data, error, loading }) => {
						return <Button disabled={loading} variant="contained" color="primary" onClick={() => {
							if(!this.state.personnel) {
								this.props.enqueueSnackbar('Please select delivery personnel.', {variant: 'error'});
								return;
							}
							orderPrepared({variables: {id: o.id, deliveryPersonnelId: this.state.personnel}})
						}}>ORDER PREPARED</Button>
					}}
					</Mutation>
				</Grid>
			</Grid>
		}
		details={<Grid container alignItems="center" spacing={8}>
			<Grid item><img alt="" src={userType !== "RESTAURANT" ? o.restaurant.profilePicture.url : (o.client.profilePicture ? o.client.profilePicture.url: '')} style={{width:24, height:24}}></img></Grid>
			<Grid item><Typography variant="h6" color="textPrimary">{userType !== "RESTAURANT"? o.restaurant.details.name : `${o.client.firstname} ${o.client.lastname}`}</Typography></Grid>
			<Grid item>
				{userType !== "RESTAURANT" &&<Button size="small" variant="outlined" onClick={() => {
					history.push(`/${o.restaurant.id}`)
				}}>
					<FoodIcon className={classes.leftIcon} />View Resto
				</Button>}
				{userType === "RESTAURANT" && <Grid item container spacing={32}>
					<Grid item><Typography variant="h6" color="textPrimary">{o.client.phoneNumber}</Typography></Grid>
					<Grid item><Typography variant="h6" color="textSecondary">{o.address}</Typography></Grid>
				</Grid>
				}
			</Grid>
			</Grid>
		}
	/>
	}
}

const PrepareOrderWith = withSnackbar(PrepareOrder);

class FullWidthTabs extends React.Component {
	state = {
		value: 0,
		tracking: false
	};

	interval = null;

	startTracking() {
		this.setState({tracking: true})
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
				createPosition(position.coords.latitude, position.coords.longitude);
			}, null, options);
			this.interval = setInterval(() => {
				navigator.geolocation.getCurrentPosition((position) => {
					createPosition(position.coords.latitude, position.coords.longitude);
				}, null, options);
			}, 1 * 60 * 1000);
		} else {
			alert('Geolocation not supported.');
		}
	}

	stopTracking() {
		this.setState({tracking: false})
		if(this.interval) {
			clearInterval(this.interval)
		}
	}

	handleChange = (event, value) => {
		this.setState({ value });
	};

	handleChangeIndex = index => {
		this.setState({ value: index });
	};

	render() {
		const { classes, theme, title, history } = this.props;
		const userType = localStorage.getItem('userType');
		return (
		<Query query={ORDERS} fetchPolicy="network-only" pollInterval={30 * 1000}>
			{({ loading, error, data }) => {
				if (loading) return '';
				if (error) return '';
				let pendingOrders = data.orders.filter(o => o.status === 'PENDING');
				let toPrepareOrders = data.orders.filter(o => o.status === 'TO_PREPARE');
				let toPickUpOrders = data.orders.filter(o => o.status === 'TO_PICK_UP');
				let toDeliverOrders = data.orders.filter(o => o.status === 'TO_DELIVER');
				let completedOrders = data.orders.filter(o => o.status === 'COMPLETED');
				let cancelledOrders = data.orders.filter(o => o.status === 'CANCELLED');
				return <div className={classes.root}>
					<Grid style={{marginTop: 8, marginBottom: 8}} container alignItems="center" justify="space-between">
						<Typography gutterBottom={true} variant="h6">{title}</Typography>
						{localStorage.getItem('userType') === 'DELIVERY_PERSONNEL' && 
							<Button variant="contained" color="secondary" onClick={() => {
								// if(this.state.tracking) {
								// 	this.stopTracking();
								// }
								// else {
								// 	this.startTracking();
								// }
								history.push('/map');
							}}>{this.state.tracking ? 'Stop tracking' : 'Track me'}</Button>
						}
					</Grid>
					<AppBar position="static" color="default">
					<Tabs
							value={this.state.value}
							onChange={this.handleChange}
							indicatorColor="primary"
							textColor="primary"
							fullWidth
						>
							<Tab label={((userType === "RESTAURANT" || userType === "CLIENT") && pendingOrders.length > 0 ) ? <Badge className={classes.margin} badgeContent={pendingOrders.length} color="secondary">
								<Typography>PENDING</Typography></Badge> : `PENDING (${pendingOrders.length})`} />
							<Tab label={((userType === "RESTAURANT" || userType === "CLIENT") && toPrepareOrders.length > 0  ) ? <Badge className={classes.margin} badgeContent={toPrepareOrders.length} color="secondary">
								<Typography>TO PREPARE</Typography></Badge> : `TO PREPARE (${toPrepareOrders.length})`} />
							<Tab label={((userType === "DELIVERY_PERSONNEL" || userType === "CLIENT" ) && toPickUpOrders.length> 0 )? <Badge className={classes.margin} badgeContent={toPickUpOrders.length} color="secondary">
								<Typography>TO PICK UP</Typography></Badge> : `TO PICK UP (${toPickUpOrders.length})`} />
							<Tab label={((userType === "DELIVERY_PERSONNEL" || userType === "CLIENT" ) && toDeliverOrders.length > 0  ) ? <Badge className={classes.margin} badgeContent={toDeliverOrders.length} color="secondary">
								<Typography>TO DELIVER</Typography></Badge> : `TO DELIVER (${toDeliverOrders.length})`} />
							<Tab label={`COMPLETED (${completedOrders.length})`} />
							<Tab label={`CANCELLED (${cancelledOrders.length})`} />
						</Tabs>
					}
					</AppBar>
					<SwipeableViews
					axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
					index={this.state.value}
					onChangeIndex={this.handleChangeIndex}
					>
						<TabContainer dir={theme.direction}>
						{
							pendingOrders.map((o) => (<Order key={o.id} o={o} classes={classes}
								actions={<Grid container justify="flex-end" alignItems="flex-end" style={{padding: '0 16px 16px 16px'}} spacing={8}>
										<Grid item style={{display: userType === 'RESTAURANT' ? 'initial': 'none'}}>
											<Mutation mutation={ACCEPT_ORDER} variables={{id: o.id}}>
											{(acceptOrder, { data, error, loading }) => {
												return <Button disabled={loading} variant="contained" color="primary" onClick={() => acceptOrder()}>Accept</Button>
											}}
											</Mutation>
											
										</Grid>
										<Grid item>
											<Mutation mutation={CANCEL_ORDER} variables={{id: o.id}}>
											{(cancelOrder, { data, error, loading }) => {
												return <Button disabled={loading} variant="contained"  onClick={() => cancelOrder()}>Cancel</Button>
											}}
											</Mutation>
										</Grid>
									</Grid>
								}
								details={<Grid container alignItems="center" spacing={8}>
									<Grid item><img alt="" src={userType !== "RESTAURANT" ? o.restaurant.profilePicture.url : (o.client.profilePicture ? o.client.profilePicture.url: '')} style={{width:24, height:24}}></img></Grid>
									<Grid item><Typography variant="h6" color="textPrimary">{userType !== "RESTAURANT"? o.restaurant.details.name : `${o.client.firstname} ${o.client.lastname}`}</Typography></Grid>
									<Grid item>
										{userType !== "RESTAURANT" &&<Button size="small" variant="outlined" onClick={() => {
											history.push(`/${o.restaurant.id}`)
										}}>
											<FoodIcon className={classes.leftIcon} />View Resto
										</Button>}
										{userType === "RESTAURANT" && <Grid item container spacing={32}>
											<Grid item><Typography variant="h6" color="textPrimary">{o.client.phoneNumber}</Typography></Grid>
											<Grid item><Typography variant="h6" color="textSecondary">{o.address}</Typography></Grid>
										</Grid>
										}
									</Grid>
									</Grid>
								}
							/>))
						}
						</TabContainer>
						<TabContainer dir={theme.direction}>
						{
							toPrepareOrders.map((o) => (<PrepareOrderWith key={o.id} o={o} classes={classes} history={history}/>))
						}
						</TabContainer>
						<TabContainer dir={theme.direction}>
						{
							toPickUpOrders.map((o) => (<Order key={o.id} o={o} classes={classes} 
								actions={<Grid container justify="flex-end" alignItems="flex-end" style={{padding: '0 16px 16px 16px'}} spacing={8}>
										<Grid item style={{display: userType === 'DELIVERY_PERSONNEL' ? 'initial': 'none'}}>
											<Mutation mutation={ORDER_PICKED_UP} variables={{id: o.id}}>
											{(orderPickedUp, { data, error }) => {
												return <Button disabled={loading} variant="contained" color="primary" onClick={() => orderPickedUp()}>ORDER PICKED UP</Button>
											}}
											</Mutation>
										</Grid>
									</Grid>
								}
								details={<Grid container alignItems="center" spacing={8}>
									<Grid item><img alt="" src={userType !== "RESTAURANT" ? o.restaurant.profilePicture.url : (o.client.profilePicture ? o.client.profilePicture.url: '')} style={{width:24, height:24}}></img></Grid>
									<Grid item><Typography variant="h6" color="textPrimary">{userType !== "RESTAURANT"? o.restaurant.details.name : `${o.client.firstname} ${o.client.lastname}`}</Typography></Grid>
									<Grid item>
										{userType !== "RESTAURANT" &&<Button size="small" variant="outlined" onClick={() => {
											history.push(`/${o.restaurant.id}`)
										}}>
											<FoodIcon className={classes.leftIcon} />View Resto
										</Button>}
										{userType === "RESTAURANT" && <Grid item container spacing={32}>
											<Grid item><Typography variant="h6" color="textPrimary">{o.client.phoneNumber}</Typography></Grid>
											<Grid item><Typography variant="h6" color="textSecondary">{o.address}</Typography></Grid>
										</Grid>
										}
									</Grid>
									</Grid>
								}
							/>))
						}
						</TabContainer>
						<TabContainer dir={theme.direction}>
						{
							toDeliverOrders.map((o) => (<Order key={o.id} o={o} classes={classes} 
								actions={<Grid container justify="flex-end" alignItems="flex-end" style={{padding: '0 16px 16px 16px'}} spacing={8}>
										<Grid item style={{display: userType === 'DELIVERY_PERSONNEL' ? 'initial': 'none'}}>
											<Mutation mutation={ORDER_DELIVERED} variables={{id: o.id}}>
											{(orderPickedUp, { data, error }) => {
												return <Button disabled={loading} variant="contained" color="primary" onClick={() => orderPickedUp()}>ORDER DELIVERED</Button>
											}}
											</Mutation>
										</Grid>
										<Grid item style={{display: userType === 'CLIENT' ? 'initial': 'none'}}>
											<Button disabled={loading} variant="contained" color="primary" onClick={() => {
												history.push(`/map/${o.deliveryPersonnel.id}`)
											}}>TRACK ORDER</Button>
										</Grid>
									</Grid>
								}
								details={<Grid container alignItems="center" spacing={8}>
									<Grid item><img alt="" src={userType === "CLIENT" ? o.restaurant.profilePicture.url : (o.client.profilePicture ? o.client.profilePicture.url: '')} style={{width:24, height:24}}></img></Grid>
									<Grid item><Typography variant="h6" color="textPrimary">{userType === "RESTAURANT"? o.restaurant.details.name : `${o.client.firstname} ${o.client.lastname}`}</Typography></Grid>
									<Grid item>
										{userType === "CLIENT" &&<Button size="small" variant="outlined" onClick={() => {
											history.push(`/${o.restaurant.id}`)
										}}>
											<FoodIcon className={classes.leftIcon} />View Resto
										</Button>}
										{userType !== "CLIENT" && <Grid item container spacing={32}>
											<Grid item><Typography variant="h6" color="textPrimary">{o.client.phoneNumber}</Typography></Grid>
											<Grid item><Typography variant="h6" color="textSecondary">{o.address}</Typography></Grid>
										</Grid>
										}
									</Grid>
									</Grid>
								}
							/>))
						}
						</TabContainer>
						<TabContainer dir={theme.direction}>
						{
							completedOrders.map((o) => (<Order key={o.id} o={o} classes={classes}
								details={<Grid container alignItems="center" spacing={8}>
									<Grid item><img alt="" src={userType !== "RESTAURANT" ? o.restaurant.profilePicture.url : (o.client.profilePicture ? o.client.profilePicture.url: '')} style={{width:24, height:24}}></img></Grid>
									<Grid item><Typography variant="h6" color="textPrimary">{userType !== "RESTAURANT"? o.restaurant.details.name : `${o.client.firstname} ${o.client.lastname}`}</Typography></Grid>
									<Grid item>
										{userType !== "RESTAURANT" &&<Button size="small" variant="outlined" onClick={() => {
											history.push(`/${o.restaurant.id}`)
										}}>
											<FoodIcon className={classes.leftIcon} />View Resto
										</Button>}
										{userType === "RESTAURANT" && <Grid item container spacing={32}>
											<Grid item><Typography variant="h6" color="textPrimary">{o.client.phoneNumber}</Typography></Grid>
											<Grid item><Typography variant="h6" color="textSecondary">{o.address}</Typography></Grid>
										</Grid>
										}
									</Grid>
									</Grid>
								}
							/>))
						}
						</TabContainer>
						<TabContainer dir={theme.direction}>
						{
							cancelledOrders.map((o) => (<Order key={o.id} o={o} classes={classes} 
								details={<Grid container alignItems="center" spacing={8}>
									<Grid item><img alt="" src={userType !== "RESTAURANT" ? o.restaurant.profilePicture.url : (o.client.profilePicture ? o.client.profilePicture.url: '')} style={{width:24, height:24}}></img></Grid>
									<Grid item><Typography variant="h6" color="textPrimary">{userType !== "RESTAURANT"? o.restaurant.details.name : `${o.client.firstname} ${o.client.lastname}`}</Typography></Grid>
									<Grid item>
										{userType !== "RESTAURANT" &&<Button size="small" variant="outlined" onClick={() => {
											history.push(`/${o.restaurant.id}`)
										}}>
											<FoodIcon className={classes.leftIcon} />View Resto
										</Button>}
										{userType === "RESTAURANT" && <Grid item container spacing={32}>
											<Grid item><Typography variant="h6" color="textPrimary">{o.client.phoneNumber}</Typography></Grid>
											<Grid item><Typography variant="h6" color="textSecondary">{o.address}</Typography></Grid>
										</Grid>
										}
									</Grid>
									</Grid>
								}
							/>))
						}
						</TabContainer>
					</SwipeableViews>
				</div>
			}}
		</Query>
		);
	}
}

export default withStyles(styles, { withTheme: true })(withRouter(withApollo(FullWidthTabs)));
