import React from 'react';
import SimpleTable from './simple-table';
import {Grid, TextField, Button, TableBody, TableRow, TableCell, FormControlLabel,
Switch, Fab, Menu, MenuItem} from '@material-ui/core';
import {withRouter, Route} from 'react-router-dom';
import AddMenuItem from './add-menuitem';
import EditMenuItem from './edit-menuitem';
import { Query } from "react-apollo";
import { MENU_ITEMS, DELETE_MENU_ITEM } from '../queries';
import NavigationIcon from '@material-ui/icons/Navigation';
import YesNoDialog from './yes-no-dialog';
import ExtendedRoute from './extended-route';

class ManageMenuItems extends React.Component {
	
	state = {
		search: '',
		includeInactive: false,
		anchorEl: null,
		id: ''
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	handleClick = id => event => {
		this.setState({ anchorEl: event.currentTarget, id });
	};

	handleCheckChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};

	handleClose = () => {
		this.setState({ anchorEl: null, id: '' });
	};

	render() {
		const {history} = this.props;
		const { anchorEl } = this.state;
		return (
			<div>
				<Grid
					container
					direction="row"
					justify="space-between"
					alignItems="center"
				>
					<Grid container item xs={6} justify="flex-start">
					<TextField
						label="Filter By Name"
						type="search"
						margin="normal"
						variant="outlined"
						onChange={this.handleChange('search')}
					/>
					<FormControlLabel style={{marginLeft: 16}}
					control={
						<Switch
							checked={this.state.includeInactive}
							onChange={this.handleCheckChange('includeInactive')}
							value="includeInactive"
						/>
					}
					label="Include Not Available Item"
					/>
					</Grid>
					<Grid container item xs={6} justify="flex-end">
						<Button variant="contained" color="primary" onClick={() => history.push('/restaurant/managemenuitems/add') }>Add Menu Item</Button>
					</Grid>
				</Grid>
				<Query query={MENU_ITEMS}>
					{({ loading, error, data }) => {
						if (loading) return '';
						if (error) return '';
						let menuItems = data.menuItems;
						if(!this.state.includeInactive) {
							menuItems = menuItems.filter((o) => o.available === true);
						}
						if(this.state.search) {
							menuItems = menuItems.filter((o) => o.name.toLowerCase().includes(this.state.search.toLowerCase()))
						}
						let tableRow = (
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Thumbnail</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Price</TableCell>
								<TableCell>Categories</TableCell>
								<TableCell>Includes Special Instruction</TableCell>
								<TableCell>Available</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						)
						let tableBody = (<TableBody>
						{menuItems.map(row => {
							return (
							<TableRow key={row.id}>
								<TableCell component="th" scope="row">
								{row.name}
								</TableCell>
								<TableCell>
									{ row.thumbnail && <img alt="" src={row.thumbnail.url} style={{width: 100, height: 100}}/>}
								</TableCell>
								<TableCell>{row.description}</TableCell>
								<TableCell>{row.price / 100}</TableCell>
								<TableCell>{row.categories.map(o => o.name).join()}</TableCell>
								<TableCell>{row.hasSpecialInstruction ? "YES":"NO"}</TableCell>
								<TableCell>{row.available ? "YES":"NO"}</TableCell>
								<TableCell>
									<Fab color="secondary" 
										aria-owns={anchorEl ? row.id : undefined}
										aria-haspopup="true"
										onClick={this.handleClick(row.id)}>
										<NavigationIcon/>
									</Fab>
									<Menu
										id={row.id}
										anchorEl={anchorEl}
										open={Boolean(anchorEl) && this.state.id === row.id}
										onClose={this.handleClose}
										>
										<MenuItem onClick={() => {
											this.handleClose();
											history.push(`/restaurant/managemenuitems/edit/${row.id}`);
										}}>Edit</MenuItem>
										<MenuItem onClick={() => {
											this.handleClose();
											history.push(`/restaurant/managemenuitems/delete/${row.id}`);
										}}>Delete Permanently</MenuItem>
									</Menu>
								</TableCell>
							</TableRow>
							);
						})}
						</TableBody>)
						return <SimpleTable tableRow={tableRow} tableBody={tableBody}/>
					}}
				</Query>
				<Route path="/restaurant/managemenuitems/add" component={AddMenuItem} />
				<Route path="/restaurant/managemenuitems/edit/:id" component={EditMenuItem} />
				<ExtendedRoute path="/restaurant/managemenuitems/delete/:id" component={YesNoDialog}
					componentProps={{
						title: 'Are you sure to delete this item?',
						mutation: DELETE_MENU_ITEM,
						update:(cache, { data: { deleteMenuItem } }) => {
							const { menuItems } = cache.readQuery({ query: MENU_ITEMS });
							cache.writeQuery({
								query: MENU_ITEMS,
								data: { menuItems: menuItems.filter(o => o.id !== deleteMenuItem.id) }
							});
						}
					}}
				/>
			</div>
		)
	}
}

export default withRouter(ManageMenuItems)