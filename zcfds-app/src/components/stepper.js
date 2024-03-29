import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
	root: {
		width: '90%',
	},
	button: {
		marginRight: theme.spacing.unit,
	},
	instructions: {
		marginTop: theme.spacing.unit,
		marginBottom: theme.spacing.unit,
	},
});

function getSteps() {
  return ['Basic Account', 'Restaurant'];
}


class HorizontalLinearStepper extends React.Component {
	state = {
		activeStep: 0,
		skipped: new Set(),
	};

	isStepOptional = step => {
		return false;
	};

	handleNext = () => {
		const { activeStep } = this.state;
		let { skipped } = this.state;
		if (this.isStepSkipped(activeStep)) {
			skipped = new Set(skipped.values());
			skipped.delete(activeStep);
		}
		this.setState({
			activeStep: activeStep + 1,
			skipped,
		});
	};

	handleBack = () => {
		this.setState(state => ({
			activeStep: state.activeStep - 1,
		}));
	};

	handleSkip = () => {
		const { activeStep } = this.state;
		if (!this.isStepOptional(activeStep)) {
			// You probably want to guard against something like this,
			// it should never occur unless someone's actively trying to break something.
			throw new Error("You can't skip a step that isn't optional.");
		}
		this.setState(state => {
			const skipped = new Set(state.skipped.values());
			skipped.add(activeStep);
			return {
				activeStep: state.activeStep + 1,
				skipped,
			};
		});
	};

	handleReset = () => {
		this.setState({
		activeStep: 0,
		});
	};

	isStepSkipped(step) {
		return this.state.skipped.has(step);
	}

	getStepContent(step) {
		return this.props.steps[step];
	}

	render() {
		const { classes } = this.props;
		const steps = getSteps();
		const { activeStep } = this.state;

		return (
		<div className={classes.root}>
			<Stepper activeStep={activeStep}>
			{steps.map((label, index) => {
				const props = {};
				const labelProps = {};
				if (this.isStepOptional(index)) {
				labelProps.optional = <Typography variant="caption">Optional</Typography>;
				}
				if (this.isStepSkipped(index)) {
				props.completed = false;
				}
				return (
				<Step key={label} {...props}>
					<StepLabel {...labelProps}>{label}</StepLabel>
				</Step>
				);
			})}
			</Stepper>
			<div>
			{activeStep === steps.length ? (
				<div>
				<Typography className={classes.instructions}>
					All steps completed - you&apos;re finished
				</Typography>
				<Button onClick={this.handleReset} className={classes.button}>
					Reset
				</Button>
				</div>
			) : (
				<div>
				{this.getStepContent(activeStep)}
				<div>
					<Button
					disabled={activeStep === 0}
					onClick={this.handleBack}
					className={classes.button}
					>
					Back
					</Button>
					{this.isStepOptional(activeStep) && (
					<Button
						variant="contained"
						color="primary"
						onClick={this.handleSkip}
						className={classes.button}
					>
						Skip
					</Button>
					)}
					{!(activeStep === steps.length - 1) && <Button
						variant="contained"
						color="primary"
						onClick={this.handleNext}
						className={classes.button}
					>
						{activeStep === steps.length - 1 ? 'Finish' : 'Next'}
					</Button>}
					
				</div>
				</div>
			)}
			</div>
		</div>
		);
	}
}

export default withStyles(styles)(HorizontalLinearStepper);