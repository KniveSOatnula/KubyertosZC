import React from 'react';
import {withStyles, Typography, Grid, Paper, Divider, Button, ListSubheader, List, IconButton} from '@material-ui/core';
import {Query, Mutation} from 'react-apollo';
import {withRouter} from 'react-router-dom';
import {AddBoxSharp} from '@material-ui/icons';
import gql from "graphql-tag";
import {ADD_TO_CART, CART} from '../queries';
import { withSnackbar } from 'notistack';

const GET_RESTAURANT = gql`
	query Restaurant($id: ID!) {
		user:restaurant(id: $id) {
			id,
			address,
			profilePicture {
				id,
				url
			},
			restaurant {
				id,
				name,
				priceRange,
				categories,
				menuItems(where: {available: true}, orderBy: name_ASC) {
					id,
					name,
					price,
					description,
					thumbnail { url },
					categories {
						id,
						name
					}
				}
			}
		}
	}
`;

const styles = {
	root:{
		margin: 32
	},
	spacing: {
		marginBottom: 8
	},
	image: {
		width: 270,
		height: 270
	},
	description: {
		maxHeight: 100,
		overflow: 'hidden',
	},
	paper:{
		width: '100%',
		padding: 16,
		display:'flex',
		flexDirection:'column'
	},
	categories: {
		flexWrap: 'nowrap',
		overflowX: 'scroll',
	},
	grow: {
		flexGrow: 1,
	},
}

class RestaurantMenu extends React.Component {
	
	state = {
		search: '',
		category: 'All',
		error: ''
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	render() {
		const {classes, match, history} = this.props;
		const auth = Boolean(localStorage.getItem('token'));
		return <Query query={GET_RESTAURANT} variables={{id: match.params.id}}>
			{({ loading, error, data }) =>{
				if (loading) return '';
				if (error) return '';
				return <div className={classes.root}>
				<Grid container spacing={32}>
					<Grid container item xs={12} sm={2} direction="column" alignItems="center">
					<img alt="" className={classes.image} src={data.user.profilePicture.url}/>
					<Typography variant="h6" style={{fontWeight: 400}}>{data.user.restaurant.name}</Typography>
					<Typography color="textSecondary">{data.user.address}</Typography>
					<Divider style={{width: '100%'}} className={classes.spacing}/>
					<Typography className={classes.spacing}>{data.user.restaurant.description}</Typography>
					<Typography color="textSecondary" align="left" style={{width: '100%'}}>Menu Categories</Typography>
					<ul align="left" style={{width: '100%'}}>
						{
							data.user.restaurant.categories.map((c,key) => <li key={key}><Typography>{c}</Typography></li>)
						}
					</ul>
					</Grid>
					<Grid item container sm={10} xs={12}>
						<Paper className={classes.paper}>
						<Grid container spacing={16} justify="space-evenly" className={classes.categories}>
							{
								data.user.restaurant.categories.map((c,key) => <Grid item key={key}><Button component="a" href={`#${c}`} style={{whiteSpace: 'nowrap'}} value={c}>{c}</Button></Grid>)
							}
						</Grid>
						{
							data.user.restaurant.categories.map((c,key) => {
								return <List key={key} subheader={<ListSubheader id={c} color="primary" align="center" disableSticky={true}  component="div">* * * {c} * * *</ListSubheader>}>
									<Divider/>
									{
										data.user.restaurant.menuItems.filter(m => m.categories.map(c => c.name).includes(c)).map((m, key) => {
											return <div key={key}>
												<Grid container justify="space-between" alignItems="center" style={{padding: 32}}>
													<Grid item>
														<Grid container alignItems="center">
														<img alt="" src={m.thumbnail.url} style={{width: 100, height: 100}} />
														<div style={{marginLeft: 32}}><Typography variant="h6">{m.name}</Typography>
														<Typography color="textSecondary" component="div">{m.description}</Typography></div>
														</Grid>
													</Grid>
													<Grid item>
														<Typography style={{display: 'inline-block'}} color="textSecondary">₱ {m.price/100}</Typography>
														<Mutation mutation={ADD_TO_CART} variables={{restaurant: data.user.id, menuItem: m.id, quantity: 1}}
															update={(cache, { data: { addToCart } }) => {
																cache.writeQuery({
																	query: CART,
																	data: { cart: addToCart }
																});
															}}
														>
														{(addToCart, { data, error, loading }) => {
															return <IconButton disabled={loading} style={{display: 'inline-block'}} size="medium" onClick={async () => {
																if(!auth) {
																	history.push('/login');
																}
																try {
																	await addToCart();
																	this.props.enqueueSnackbar('Successfully added to cart.', {variant: 'success'});
																} catch (error) {
																	error.graphQLErrors.forEach(({ message }) => {
																		this.props.enqueueSnackbar(message, {variant: 'error'});
																	})
																}
															}}><AddBoxSharp color="secondary"/></IconButton>
														}}
														</Mutation>
													</Grid>
												</Grid>
												<Divider/>
											</div>
										})
									}
								</List>
							})
						}
						</Paper>
					</Grid>
				</Grid>
				</div>
			}}
			</Query>
	}

}

export default withStyles(styles)(withRouter(withSnackbar(RestaurantMenu)));