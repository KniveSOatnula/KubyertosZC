import React from 'react';
import {Typography, withStyles, Grid, Divider, FormControlLabel, Checkbox, TextField, InputAdornment, Paper, Button,
Select, FilledInput, MenuItem, FormControl} from '@material-ui/core';
import {Query} from 'react-apollo';
import {withRouter} from 'react-router-dom';
import {CATEGORIES} from '../queries';
import Search from '@material-ui/icons/Search';
import gql from "graphql-tag";

const RESTAURANTS = gql`
	query Restaurants($isActive: Boolean) {
		restaurants(isActive: $isActive) {
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
				categories
			}
		}
	}
`;

const styles = {
	root: {
		margin: 32
	},
	spacing: {
		marginBottom: 8
	},
	paper:{
		width: '100%',
		padding: 16,
		height: 500
	},
	image: {
		width: 270,
		height: 270
	},
	description: {
		maxHeight: 100,
		overflow: 'hidden',
	}
}

const StyledFilledInput = withStyles({
	input: {
		padding: '10px 12px 10px'
	},
  })(FilledInput);

class FindRestaurant extends React.Component {

	state = {
		filterCategories: [],
		search: '',
		sortBy: 'name_ASC'
	}

	handleFilterCategoriesChange = name => event => {
		if(event.target.checked) {
			this.setState({
				filterCategories: this.state.filterCategories.concat([name])
			});
		}
		else {
			this.setState({
				filterCategories: this.state.filterCategories.filter(o => o !== name)
			});
		}
	};

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	render() {
		const {classes, history} = this.props;
		return <div className={classes.root}>
		<Typography color="secondary" variant="h4" style={{marginBottom: 32}}>
			Find Restaurants
		</Typography>
		<Grid container spacing={32}>
			<Grid item xs={12} sm={2} container direction="column">
				<Typography variant="h6" className={classes.spacing}>Filter</Typography>
				<Typography color="textSecondary" >Food Categories</Typography>
				<Divider className={classes.spacing}/>
				<Query query={CATEGORIES}>
				{({ loading, error, data }) =>{
					if (loading) return '';
					if (error) return '';
					return data.categories.map((o, key) => {
						return <FormControlLabel key={key}
						control={
							<Checkbox checked={this.state.filterCategories.includes(o.name)} onChange={this.handleFilterCategoriesChange(o.name)} value={o.name} />
						}
						label={o.name}
					/>
					})
				}}
				</Query>
			</Grid>
			<Grid item xs={12} sm={10} container direction="column">
				<Grid container item direction="row" spacing={8}>
					<Grid item xs={6} sm={10}><TextField fullWidth={true}
						className={classes.spacing}
						variant="filled"
						placeholder="Search for Restaurants"
						value={this.state.search}
						onChange={this.handleChange('search')}
						InputProps={{
							startAdornment: (
							<InputAdornment style={{marginTop: 4}} variant="filled" position="start">
								<Search/>
							</InputAdornment>
							),
							
						}}
						inputProps={{
							style: {padding:'10px 12px 10px'}
						}}
					/></Grid>
					<Grid item xs={6} sm={2}>
					<FormControl fullWidth={true} variant="filled" >
					<Select
						value={this.state.sortBy}
						onChange={this.handleChange('sortBy')}
						input={<StyledFilledInput />}
					>
						<MenuItem value="name_ASC">Name - A-Z</MenuItem>
						<MenuItem value="name_DESC">Name - Z-A</MenuItem>
						<MenuItem value="price_ASC">Price - lowest to highest</MenuItem>
						<MenuItem value="price_DESC">Price - highest to lowest</MenuItem>
					</Select>
					</FormControl>
					</Grid>
				</Grid>
				
				<Query query={RESTAURANTS} variables={{isActive:true}}>
					{({data, loading, error}) => {
						if (loading) return '';
						if (error) return '';
						let restaurants = data.restaurants;
						if(this.state.search) {
							restaurants = restaurants.filter(o => o.restaurant.name.toLowerCase().replace(" ", "").includes(this.state.search.toLowerCase()))
						}
						if(this.state.filterCategories.length > 0) {
							restaurants = restaurants.filter(o => {
								let bool = false;
								for (const c of this.state.filterCategories) {
									if(o.restaurant.categories.includes(c)) {
										bool = true;
										break;
									}
								}
								return bool;
							})
						}
						if(this.state.sortBy === 'name_ASC') {
							 restaurants.sort(function(a, b){
								if(a.restaurant.name.toLowerCase() < b.restaurant.name.toLowerCase()) { return -1; }
								if(a.restaurant.name.toLowerCase() > b.restaurant.name.toLowerCase()) { return 1; }
								return 0;
							})
						}
						else if(this.state.sortBy === 'name_DESC') {
							restaurants.sort(function(a, b){
								if(a.restaurant.name.toLowerCase() < b.restaurant.name.toLowerCase()) { return 1; }
								if(a.restaurant.name.toLowerCase() > b.restaurant.name.toLowerCase()) { return -1; }
								return 0;
							})
						}
						else if(this.state.sortBy === 'price_ASC') {
							restaurants.sort(function(a, b){
								if(a.restaurant.priceRange[0] < b.restaurant.priceRange[0]) { return -1; }
								if(a.restaurant.priceRange[0] > b.restaurant.priceRange[0]) { return 1; }
								return 0;
							})
						}else if(this.state.sortBy === 'price_DESC') {
							restaurants.sort(function(a, b){
								if(a.restaurant.priceRange[0] < b.restaurant.priceRange[0]) { return 1; }
								if(a.restaurant.priceRange[0] > b.restaurant.priceRange[0]) { return -1; }
								return 0;
							})
						}

						return <div><Typography variant="h6">Restaurants({restaurants.length})</Typography>
						<Grid item container spacing={32} direction="row"  >
							{restaurants.map((o, key) => {
								return <Grid item xs={12} sm={3} key={key}>
									<Paper className={classes.paper}>
									<Grid container direction="column" alignItems="center">
										<img alt="" className={classes.image} src={o.profilePicture ? o.profilePicture.url : ''}/>
										<Typography variant="h6" style={{fontWeight: 400}}>{o.restaurant.name}</Typography>
										<Typography color="textSecondary">{o.address}</Typography>
										<Divider  style={{width: '100%'}} className={classes.spacing}/>
										<Typography className={`${classes.description} ${classes.spacing}`} color="textSecondary">
											{o.restaurant.categories.join(' ,')}
										</Typography>
										<Typography style={{width:'100%'}} align="left">Menu Price range:</Typography>
										<Typography style={{width:'100%'}} align="left">{o.restaurant.priceRange.map(o => `₱ ${o/100}`).join(' - ')}</Typography>
										<Button color="primary" onClick={() => history.push(`/menu/${o.id}`)}>View Menu</Button>
									</Grid>
									</Paper>
								</Grid>
							})}
						</Grid></div>
					}}
					
				</Query>
			</Grid>
		</Grid>
		</div>
	}
}

export default withStyles(styles)(withRouter(FindRestaurant));