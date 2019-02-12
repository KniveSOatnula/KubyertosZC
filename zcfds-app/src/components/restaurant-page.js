import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import {withRouter, Route} from 'react-router-dom';
import ManagePersonnels from './manage-personnels';
import ManageMenuItems from './manage-menuitems';

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

class RestaurantPage extends React.Component {
	
	constructor(props) {
		super(props);
		let value = "/restaurant/managemenuitems";
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
				<LinkTab value="/restaurant/managemenuitems" label="Manage Menu Item" onClick={() => history.push('/restaurant/managemenuitems') }/>
				</Tabs>
			</AppBar>
			<TabContainer>
				<Route  path="/restaurant/managemenuitems" component={ManageMenuItems} />
			</TabContainer>
			</div>
		</NoSsr>
		);
	}
}


export default withStyles(styles)(withRouter(RestaurantPage));
