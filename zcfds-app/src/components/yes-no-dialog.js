import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import {withRouter} from 'react-router-dom';
import {Mutation} from 'react-apollo';

class YesNoDialog extends React.Component {

	state = {
		id: ''
	}

	async componentDidMount() {
		const { match } = this.props;
		this.setState({
			id: match.params.id
		})
	}

	render() {
		const {title, history, mutation, variables, update} = this.props;
		return (<Mutation mutation={mutation} update={update}>
			{(mutation, { data, error, loading }) => {
			if(data) {
				history.goBack();
			}
			return <Dialog
				open={true}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				>
				<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
				<DialogActions>
					<Button onClick={() => history.goBack()} color="primary">
					No
					</Button>
					<Button  disabled={loading} onClick={() =>{
						mutation({variables: {...variables, id: this.state.id}});
					}} color="primary" autoFocus>
					Yes
					</Button>
				</DialogActions>
				</Dialog>
			}}
			</Mutation>
		);
	}
}

export default withRouter(YesNoDialog);