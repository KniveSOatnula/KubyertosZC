import React from 'react';
import {withStyles, Typography, Grid, Paper, Button, TextField, Divider} from '@material-ui/core';
import LocationIcon from '@material-ui/icons/LocationOn';
import {CART, CHECKOUT, ME} from '../queries';
import {Query, Mutation, withApollo} from 'react-apollo';
import { withSnackbar } from 'notistack';

const styles = {
	root: {
		margin: 32
	},
}

class CheckoutPage extends React.Component {
	
	state = {
		enableChangeAddress: false,
		address: '',
		phoneNumber: ''
	}

	async componentDidMount() {
		const { client } = this.props;
		let { data: {me} } = await client.query({query: ME});
		this.setState({
			address: me.address,
			phoneNumber: me.phoneNumber
		})
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	render() {
		const {classes, history} = this.props;
		return <div className={classes.root}>
			<Typography color="secondary" variant="h4" style={{marginBottom: 32}}>
				Checkout
			</Typography>
			<Query query={ME}>
				{({ loading, error, data }) => {
					if (loading) return '';
					if (error) return '';
					return <Paper>
						<Grid container style={{padding: 16}}>
							<Grid item container justify="flex-start" alignItems="center">
								<LocationIcon color="secondary"/>
								<Typography variant="h5" color="secondary">Delivery Address</Typography>
							</Grid>
							{
								!this.state.enableChangeAddress &&
								<Grid item container justify="space-between" alignItems="center">
									<Grid item container xs={10} spacing={32}>
										<Grid item><Typography variant="h6" color="textPrimary">{data.me.firstname} {data.me.lastname} {data.me.phoneNumber}</Typography></Grid>
										<Grid item><Typography variant="h6" color="textSecondary">{this.state.address}</Typography></Grid>
									</Grid>
									<Grid item container xs={2} justify="flex-end" >
										<Button onClick={() => {this.setState({enableChangeAddress: true})}}>{this.state.address ? 'Change': 'Set'}</Button>
									</Grid>
								</Grid>
							}
							{
								this.state.enableChangeAddress &&
								<Grid item container alignItems="center">
									<Grid item container xs={12} alignItems="center">
										<Typography variant="h6" color="textPrimary">{data.me.firstname} {data.me.lastname} {data.me.phoneNumber}</Typography>
										<TextField
											required
											type="text"
											name="address"
											margin="normal"
											variant="outlined"
											fullWidth={true}
											value={this.state.address}
											onChange={this.handleChange('address')}
										/>
									</Grid>
									<Grid item container xs={12} alignItems="center" spacing={16}>
										<Grid item><Button variant="contained" color="secondary" onClick={() => this.setState({enableChangeAddress: false})}>Save</Button></Grid>
									</Grid>
								</Grid>
							}
						</Grid>
					</Paper>
				}}
			</Query>
			<Paper style={{marginTop: 16, padding: 16}}>
				<Grid container>
					<Grid item xs={9}><Typography variant="subtitle2">Products Ordered</Typography></Grid>
					<Grid item xs={1} container justify="center"><Typography color="textSecondary">Unit Price</Typography></Grid>
					<Grid item xs={1} container justify="center"><Typography color="textSecondary">Amount</Typography></Grid>
					<Grid item xs={1} container justify="flex-end"><Typography color="textSecondary">Order Subtotal</Typography></Grid>
				</Grid>
			</Paper>
			<Query query={CART}>
					{({ loading, error, data }) => {
							if (loading) return '';
							if (error) return '';
							return <Paper style={{marginTop: 16, padding: 16}}>
								<Grid container spacing={16}>
									<Grid item container alignItems="center" spacing={8}>
										<Grid item><img alt="" src={data.cart.restaurant.profilePicture.url} style={{width: 24}}></img></Grid>
										<Grid item><Typography variant="subtitle2">{data.cart.restaurant.details.name}</Typography></Grid>
									</Grid>
									<Divider style={{width: '100%'}}/>
									{data.cart.cartItems.map((o, index) => (
										<Grid container item key={index}>
											<Grid container item xs={7} alignItems="center" spacing={8}>
												<Grid item><img alt="" src={o.menuItem.thumbnail.url} style={{width: 24}}></img></Grid>
												<Grid item><Typography variant="subtitle2">{o.menuItem.name}</Typography></Grid>
											</Grid>
											<Grid item xs={2}><Typography color="textSecondary">{o.specialInstruction}</Typography></Grid>
											<Grid item xs={1} container justify="center"><Typography>₱ {o.menuItem.price/100}</Typography></Grid>
											<Grid item xs={1} container justify="center"><Typography>{o.quantity}</Typography></Grid>
											<Grid item xs={1} container justify="flex-end"><Typography>₱ {o.menuItem.price * o.quantity / 100}</Typography></Grid>
										</Grid>
									))
									}
								</Grid>
								<Divider/>
								<Grid container item xs={12} style={{backgroundColor: "#f9fdff", marginTop: 16, marginBottom: 16}} justify="flex-end" alignItems="center" spacing={16}>
									<Grid item><Typography color="textSecondary">Order Total ({data.cart.cartItems.reduce((sum, o) => sum + o.quantity, 0)} item):</Typography></Grid>
									<Grid item><Typography color="secondary" variant="h5">₱ {data.cart.cartItems.reduce((sum, o) => sum + o.menuItem.price * o.quantity, 0)/100}</Typography></Grid>
								</Grid>
								<Divider/>
								<Mutation mutation={CHECKOUT}
									update={(cache, { data: { checkout } }) => {
										cache.writeQuery({
											query: CART,
											data: { cart: checkout }
										});
									}}
								>
									{(checkout, { loading }) => {
										return <Grid container item xs={12} style={{backgroundColor: "#f9fdff", marginTop: 16, marginBottom: 8}} justify="flex-end" alignItems="center" spacing={16}>
											<Button variant="contained" disabled={loading} color="secondary" onClick={ async () => {
												if(!this.state.phoneNumber) {
													this.props.enqueueSnackbar('Please add Phone Number to your account.', {variant: 'error'});
													return;
												}
												try {
													await checkout({variables:{address: this.state.address}});
													this.props.enqueueSnackbar('Successfully placed order.', {variant: 'success'});
													history.push('/manageorders');
												} catch (error) {
													console.log({error})
													if( error.graphQLErrors) {
														error.graphQLErrors.forEach(({ message }) => {
															this.props.enqueueSnackbar(message, {variant: 'error'});
														})
													}
												}
												}}>Place Order</Button>
										</Grid> 
									}}
									
								</Mutation>
							</Paper>
					}}
			</Query>
			
			
		</div>
	}
}

export default withStyles(styles)(withApollo(withSnackbar(CheckoutPage)));