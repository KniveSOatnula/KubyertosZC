import React from 'react';
import SimpleTable from './simple-table';
import { Query } from "react-apollo";
import {Typography, Divider, TableCell, TableRow, TableBody} from '@material-ui/core';
import { MY_PERSONNELS } from '../queries';

class MyPersonnels extends React.Component {

	render() {
		return <div style={{margin: 32}}>
			<Typography color="secondary" variant="h4" style={{marginBottom: 32}}>
				My Personnels
			</Typography>
			<Divider/>
			<Query query={MY_PERSONNELS}>
				{({ loading, error, data }) => {
					if (loading) return '';
					if (error) return '';
					let tableRow = (
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Plate Number</TableCell>
							<TableCell>Phone Number</TableCell>
						</TableRow>
					)
					let tableBody = (<TableBody>
					{data.mypersonnels.map(row => {
						return (
						<TableRow key={row.id}>
							<TableCell component="th" scope="row">
							{row.firstname} {row.lastname}
							</TableCell>
							<TableCell>{row.plateNumber}</TableCell>
							<TableCell>{row.phoneNumber}</TableCell>
						</TableRow>
						);
					})}
					</TableBody>)
					return <SimpleTable tableRow={tableRow} tableBody={tableBody}/>
				}}
			</Query>
		</div>
	}
}

export default MyPersonnels;