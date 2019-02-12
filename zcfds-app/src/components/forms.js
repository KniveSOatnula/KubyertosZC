import React from 'react';
import {Grid, FormControl, FormGroup, TextField, FormLabel, FormControlLabel, Checkbox, FormHelperText} from '@material-ui/core';
import CroppingDialog from './cropping';

export const AccountForm = (props) =>{
	const {data, handleChange, loadFile, handleClose, hidePasswoedField, error} = props;
	return(<div style={{marginBottom: 32}}>
	<FormControl fullWidth required error={Boolean(error)} component="fieldset">
		<FormGroup>
		<input type="file" accept="image/*" onChange={loadFile}/>
		<img alt="" src={data.src} style={{
			width: 300,
			height: 300
		}} />
		<TextField
			required
			label="Email"
			type="email"
			name="email"
			autoComplete="email"
			margin="normal"
			variant="outlined"
			value={data.email}
			onChange={handleChange('email')}
		/>
		{!hidePasswoedField && <TextField
			required
			label="Password"
			name="password"
			type="password"
			autoComplete="current-password"
			margin="normal"
			variant="outlined"
			value={data.password}
			onChange={handleChange('password')}
		/>}
		<TextField
			required
			label="Firstname"
			type="text"
			name="firstname"
			margin="normal"
			variant="outlined"
			value={data.firstname}
			onChange={handleChange('firstname')}
		/>
		<TextField
			required
			label="Lastname"
			type="text"
			margin="normal"
			variant="outlined"
			value={data.lastname}
			onChange={handleChange('lastname')}
		/>
		<TextField
			label="Address"
			placeholder="House No./Building Name, Street/Drive , Barangay"
			multiline
			margin="normal"
			variant="outlined"
			value={data.address}
			onChange={handleChange('address')}
		/>
		</FormGroup>
		<FormHelperText>
			{error && <span>{error}</span>}
		</FormHelperText>
		</FormControl>
		{data.open && <CroppingDialog src={data.src} file={data.file} handleClose={handleClose} />}
		</div>
	)
}

export const RestaurantForm = (props) =>{
	const {data, handleChange, handleCheckChange, error} = props;
	return(<div style={{marginBottom: 32}}>
	<FormControl fullWidth required error={Boolean(error)} component="fieldset">
		<FormGroup>
		<TextField
			required
			label="Name"
			type="text"
			name="name"
			margin="normal"
			variant="outlined"
			value={data.name}
			onChange={handleChange('name')}
		/>
		<TextField
			required
			label="Description"
			type="text"
			name="description"
			margin="normal"
			multiline
			variant="outlined"
			value={data.description}
			onChange={handleChange('description')}
		/>
		<TextField
			required
			label="Tel. Number"
			type="text"
			margin="normal"
			variant="outlined"
			value={data.telephoneNumber}
			onChange={handleChange('telephoneNumber')}
		/>
		<Grid container justify="flex-start" alignItems="center" direction="row">
			<FormLabel component="legend">Days Open</FormLabel>
			<FormControlLabel
				control={
				<Checkbox checked={data.sun} onChange={handleCheckChange('sun')} value="Sun" />
				}
				label="Sun"
			/>
			<FormControlLabel
				control={
				<Checkbox checked={data.mon} onChange={handleCheckChange('mon')} value="Mon" />
				}
				label="Mon"
			/>
			<FormControlLabel
				control={
				<Checkbox checked={data.tue} onChange={handleCheckChange('tue')} value="Tue" />
				}
				label="Tue"
			/>
			<FormControlLabel
				control={
				<Checkbox
					checked={data.wed}
					onChange={handleCheckChange('wed')}
					value="Wed"
				/>
				}
				label="Wed"
			/>
			<FormControlLabel
				control={
				<Checkbox checked={data.thu} onChange={handleCheckChange('thu')} value="Thu" />
				}
				label="Thu"
			/>
			<FormControlLabel
				control={
				<Checkbox checked={data.fri} onChange={handleCheckChange('fri')} value="Fri" />
				}
				label="Fri"
			/>
			<FormControlLabel
				control={
				<Checkbox
					checked={data.sat}
					onChange={handleCheckChange('sat')}
					value="Sat"
				/>
				}
				label="Sat"
			/>
		</Grid>
		<TextField
			label="Opening Time"
			type="time"
			value={data.startTime}
			InputLabelProps={{
				shrink: true,
			}}
			inputProps={{
				step: 5 * 60
			}}
			variant="outlined"
			margin="normal"
			onChange={handleChange("startTime")}
		/>
		<TextField
			label="Closing Time"
			type="time"
			InputLabelProps={{
				shrink: true,
			}}
			inputProps={{
				step: 5 * 60
			}}
			variant="outlined"
			margin="normal"
			value={data.endTime}
			onChange={handleChange("endTime")}
		/>
		</FormGroup>
		<FormHelperText>
			{error && <span>{error}</span>}
		</FormHelperText>
		</FormControl>
		</div>
	)
}
