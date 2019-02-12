import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {SwipeableDrawer, List, Grid, Divider, IconButton, Typography, Button} from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import {Query, Mutation} from 'react-apollo';
import {CART, ADD_TO_CART, REMOVE_FROM_CART} from '../queries';
import { withSnackbar } from 'notistack';
import {withRouter} from 'react-router-dom';

const styles = {
	list: {
		width: 350,
	},
};

class SwipeableTemporaryDrawer extends React.Component {
	render() {
		const { classes, toggleDrawer, open, history } = this.props;
		return (
			<div>
				<SwipeableDrawer
				anchor="right"
				open={open}
				onClose={toggleDrawer(false)}
				onOpen={toggleDrawer(true)}
				>
				<Query query={CART}>
					{({ loading, error, data }) => {
							if (loading) return '';
							if (error) return '';
							return <div>
							<Typography variant="h6" style={{padding: 16}}>
								Your order from	{data.cart.restaurant.details.name}
							</Typography>
							<div className={classes.list}>
								<List>
								{data.cart.cartItems.map((o, index) => (
									<Grid container justify="space-between" key={index}>
										<Grid item container direction="row" alignItems="center" xs={8}>
											<Mutation mutation={ADD_TO_CART} variables={{restaurant: data.cart.restaurant.id, menuItem: o.menuItem.id, quantity: -1}}
												update={(cache, { data: { addToCart } }) => {
													cache.writeQuery({
														query: CART,
														data: { cart: addToCart }
													});
												}}
											>
											{(addToCart, { data, error, loading }) => {
												return <IconButton disabled={loading || o.quantity === 1} onClick={() => {
													addToCart();
												}}><RemoveIcon color="secondary"/></IconButton>
											}}
											</Mutation>
											<Typography>{o.quantity}</Typography>	
											<Mutation mutation={ADD_TO_CART} variables={{restaurant: data.cart.restaurant.id, menuItem: o.menuItem.id, quantity: 1}}
												update={(cache, { data: { addToCart } }) => {
													cache.writeQuery({
														query: CART,
														data: { cart: addToCart }
													});
												}}
											>
											{(addToCart, { data, error, loading }) => {
												return <IconButton disabled={loading} onClick={() => {
													addToCart();
												}}><AddIcon color="secondary"/></IconButton>
											}}
											</Mutation>
											<Typography style={{width: 120}} noWrap={true} color="textSecondary">{o.menuItem.name}</Typography>
										</Grid>
										<Grid item container xs={4} alignItems="center" justify="space-between">
											<Typography style={{fontWeight: 300}}>₱ {(o.menuItem.price * o.quantity)/100}</Typography>
											<Mutation mutation={REMOVE_FROM_CART} variables={{menuItem: o.menuItem.id}}
												update={(cache, { data: { removeFromCart } }) => {
													cache.writeQuery({
														query: CART,
														data: { cart: removeFromCart }
													});
												}}
											>
											{(removeFromCart, { data, error, loading }) => {
												return <IconButton disabled={loading} onClick={() => {
													removeFromCart();
												}}><CancelIcon nativeColor="#ff6841"/></IconButton>
											}}
											</Mutation>
										</Grid>
									</Grid>
								))}
								</List>
								<Divider />
								<List>
								<Grid container justify="space-between">
									<Grid item container direction="row" alignItems="center" xs={8} style={{padding: 16}}>
									<Typography>Total</Typography>
									</Grid>
									<Grid item container xs={4} alignItems="center">
										<Typography>₱ {data.cart.cartItems.reduce((sum, o) => sum + o.menuItem.price * o.quantity, 0)/100} </Typography>
									</Grid>
								</Grid>
								</List>
								<div style={{padding: 16}}>
									<Button variant="contained" fullWidth={true} color="secondary" onClick={() => {
										if(data.cart.cartItems <= 0) {
											this.props.enqueueSnackbar('Empty cart!', {variant: 'error'});
											return;
										}
										toggleDrawer(false)();
										history.push('/checkout');
									}}>Checkout</Button>
								</div>
								
								</div>
							</div>
						}}
					</Query>
				</SwipeableDrawer>
			</div>
		);
	}
}

export default withStyles(styles)(withRouter(withSnackbar(SwipeableTemporaryDrawer)));