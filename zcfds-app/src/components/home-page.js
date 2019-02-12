import React from 'react';
import {Query} from 'react-apollo';
import {RESTAURANTS} from '../queries'
import {Grid, withStyles, Typography} from '@material-ui/core';
import banner from '../images/table.jpg';
import wood from '../images/wood.jpg';
import {withRouter} from 'react-router-dom';

const styles = {
	container:{
		display: 'flex',
		justifyContent: "flex-start",
		flexDirection: "column",
		alignItems: "center",
		padding: 32,
		backgroundImage: `url("${wood}")`,
		backgroundSize: 'cover'
	},
	coverPhoto: {
		width: "100%",
		height: 600,
		objectFit: "cover"
	},
	title: {
		marginBottom: 32
	},
	img : {
		width: 270,
		height: 270
	},
	description: {
		padding: 8
	}
}

class HomePage extends React.Component {
	render() {
		const {classes, history} = this.props;
		return (
			<div>
			<div style={{position: 'relative', fontSize: 0}}>
				<img alt="" className={classes.coverPhoto} src={banner}/>
				<Typography color="textPrimary" style={{
					position: 'absolute',
					top: 74,
					textAlign: 'center',
					right:0,
					left:0,
					color: "#fff"
				}} variant="h2">Sign Up Now to Order from food <br/>
					Establishment within the city!!
				</Typography>
			</div>
			<Query query={RESTAURANTS} variables={{isActive:true}}>
				{({ loading, error, data }) => {
					if (loading) return '';
					if (error) return '';
					return <div className={classes.container}>
						<Typography style={{color:"#fff"}} className={classes.title} color="textPrimary" variant="h4">Available Restaurants</Typography>
						<Grid container justify="center">
						{
							data.restaurants.map(o => {
								return <Grid key={o.id} container item xs sm={4} direction="column" alignItems="center">
									<img alt="" src={o.profilePicture ? o.profilePicture.url : ''} className={classes.img}/>
									<Typography style={{color:"#fff"}} className={classes.description} color="textSecondary" variant="body2">{o.restaurant.description}</Typography>
									<Typography style={{color:"#fff"}} color="textPrimary" variant="h6" onClick={() => {
										history.push(`/menu/${o.restaurant.id}`)
									}}>{o.restaurant.name}</Typography>
								</Grid>
							})
						}
						</Grid>
					</div>
				}}
			</Query>
			</div>
		)
	}
}

export default withStyles(styles)(withRouter(HomePage));