import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem} from '@material-ui/core';
import {withRouter}  from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FoodIcon from '@material-ui/icons/FastfoodOutlined';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import { Query, withApollo } from "react-apollo";
import { ME, CART } from '../queries';
import Cart from './cart';

const styles = theme => ({
	root: {
		flexGrow: 1
	},
	grow: {
		flexGrow: 1,
	},
	firstname: {
		marginLeft: 8
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
		  display: 'flex',
		},
	},
	sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'none',
		},
	},
});

class ButtonAppBar extends React.Component {

	state = {
		anchorEl: null,
		openCart: false
	};

	toggleDrawer = (open) => () => {
		this.setState({
			openCart: open,
		});
	};
		
	handleChange = event => {
		this.setState({ auth: event.target.checked });
	};
	
	handleMenu = event => {
		this.setState({ anchorEl: event.currentTarget });
	};
	
	handleClose = () => {
		this.setState({ anchorEl: null });
	};

	render() {
		const { classes, history, client, location } = this.props;
		const { anchorEl } = this.state;
		const auth = Boolean(localStorage.getItem('token'));
		const open = Boolean(anchorEl);
		const userType = localStorage.getItem('userType');
		return (
			<div className={classes.root}>
			<AppBar style={{backgroundColor: '#fefaef'}} color="primary" position="fixed">
				<Toolbar>
				<Button onClick={() => history.push('/')}>
					<Typography variant="h4" color="primary">
						KUBYERTOS
					</Typography>
				</Button>
				{(userType === 'CLIENT' || Boolean(userType) === false) && <Button className={classes.sectionDesktop} color="primary" onClick={() => history.push('/find-restaurants')}>FIND RESTAURANTS</Button>}
				{(userType === 'CLIENT' || Boolean(userType) === false) && <IconButton className={classes.sectionMobile} onClick={() => history.push('/find-restaurants')}>
					<FoodIcon color="primary"/>
				</IconButton>}
				<div className={classes.grow}/>
				{!auth && (<Button style={{marginRight: 8}} variant="contained" color="secondary" onClick={() => history.push('/login')}>LOGIN</Button>)}
				{!auth && (<Button variant="contained" color="primary" onClick={() => history.push('/signup')}>SIGN UP</Button>)}
				{auth && (
				<div>
					{localStorage.getItem('userType') === 'CLIENT' && <Query query={CART}>
					{({ loading, error, data }) => {
						if (loading) return '';
						if (error) return '';
						return <IconButton onClick={() => {
								if(data.cart && !location.pathname.includes(data.cart.restaurant.id)) {
									history.push(`/${data.cart.restaurant.id}`);
								}
								this.toggleDrawer(true)();
							}}>
							<ShoppingCartOutlinedIcon color="primary"/>
						</IconButton>
					}}
					</Query>}
					
					<IconButton
					aria-owns={open ? 'menu-appbar' : undefined}
					aria-haspopup="true"
					onClick={this.handleMenu}
					color="inherit"
					>
					<AccountCircle color="primary" />
					<Query query={ME}>
					{({ loading, error, data }) => {
						if (loading) return '';
						if (error) return '';
						return <Typography className={classes.firstname}>{data.me.firstname}</Typography>
					}}
					</Query>
					
					</IconButton>
					<Menu
					id="menu-appbar"
					anchorEl={anchorEl}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={open}
					onClose={this.handleClose}
					>
					<MenuItem onClick={() => {
						this.handleClose();
						history.push('/myaccount');
					}}>My account</MenuItem>
					{userType === 'ADMIN' && <MenuItem onClick={() => {
						history.push('/admin/managerestaurants');
					}}>Manage Restaurants</MenuItem>}
					{userType === 'CLIENT' &&  <MenuItem onClick={() => {
						history.push('/myorders');
					}}>My orders</MenuItem>}
					{userType === 'RESTAURANT' && <MenuItem onClick={() => {
						history.push('/restaurant/managemenuitems');
					}}>Manage Menu Items</MenuItem>}
					{userType === 'RESTAURANT' && <MenuItem onClick={() => {
						history.push('/mypersonnels');
					}}>My personnels</MenuItem>}
					{(userType === 'RESTAURANT' || userType === 'DELIVERY_PEPRSONNEL')  && <MenuItem onClick={() => {
						history.push('/manageorders');
					}}>Manage orders</MenuItem>
					}
					<MenuItem onClick={() => {
						this.setState({ anchorEl: null });
						localStorage.removeItem('token');
						localStorage.removeItem('userType');
						client.resetStore();
						history.push('/login');
					}}>Logout</MenuItem>
					</Menu>
				</div>
				)}
				</Toolbar>
			</AppBar>
			<Cart toggleDrawer={this.toggleDrawer} open={this.state.openCart} />
			</div>
		);
	}
}

export default withStyles(styles)(withApollo(withRouter(ButtonAppBar)))