import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
	root: {
		width: '100%',
		marginTop: theme.spacing.unit * 3,
		overflowX: 'auto',
	},
	table: {
		minWidth: 700,
	},
});

function SimpleTable(props) {
	const { classes, tableBody, tableRow} = props;

	return (
		<Paper className={classes.root}>
		<Table className={classes.table}>
			<TableHead>
			{tableRow}
			</TableHead>
			{tableBody}
		</Table>
		</Paper>
	);
}

export default withStyles(styles)(SimpleTable);