import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import {withRouter, Route} from 'react-router-dom';
import ManagePersonnels from './manage-personnels';
import ManageRestaurants from './manage-restaurants';
import ManageCategories from './manage-categories';

function TabContainer(props) {
	return (
		<Typography component="div" style={{ padding: 8 * 3 }}>
		{props.children}
		</Typography>
	);
}

function LinkTab(props) {
	return <Tab component="a" onClick={event => event.preventDefault()} {...props} />;
}

const styles = theme => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
});

class AdminPage extends React.Component {
	
	constructor(props) {
		super(props);
		let value = "/admin/managecategories";
		if(props.location.pathname) {
			value = props.location.pathname.split('/').slice(0, 3).join('/');
		}

		this.state = { value }
	}

	handleChange = (event, value) => {
		this.setState({ value });
	};

	render() {
		const { classes, history } = this.props;
		const { value } = this.state;
		return (
		<NoSsr>
			<div className={classes.root}>
			<AppBar position="static">
				<Tabs value={value} fullWidth onChange={this.handleChange}>
				<LinkTab value="/admin/managerestaurants" label="Manage Restaurants" onClick={() => history.push('/admin/managerestaurants') }/>
				<LinkTab value="/admin/managepersonnels" label="Manage Delivery Personnel" onClick={() => history.push('/admin/managepersonnels') }/>
				<LinkTab value="/admin/managecategories" label="Manage Food Categories" onClick={() => history.push('/admin/managecategories') }/>
				</Tabs>
			</AppBar>
			<TabContainer>
				<Route  path="/admin/managerestaurants" component={ManageRestaurants} />
				<Route  path="/admin/managepersonnels" component={ManagePersonnels} />
				<Route  path="/admin/managecategories" component={ManageCategories} />
			</TabContainer>
			</div>
		</NoSsr>
		);
	}
}


export default withStyles(styles)(withRouter(AdminPage));
