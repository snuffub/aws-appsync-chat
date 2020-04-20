import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import NativeSelect from "@material-ui/core/NativeSelect";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

//import DateTimePicker from "react-datetime-picker";

import MomentUtils from "@date-io/moment";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

const HealthModal = ({
  onCloseModal,
  onSaveModal,
  openHealthModal,
  modalStateName,
}) => {
  const [values, setValues] = useState({
    healthInfo: "weight",
    weight: 0,
    bpDiastolic: 0,
    bpSystolic: 0,
    temp: 98.6,
    bmi: 0,
    pulse: 0,
    date: new Date(),
  });

  const handleEnter = () => {
    setValues({
      ...values,
      healthInfo: "weight",
      weight: 0,
      bpDiastolic: 0,
      bpSystolic: 0,
      temp: 98.6,
      bmi: 0,
      pulse: 0,
      date: new Date(),
    });
  };

  const onInputKeyUp = (e) => {
    if (e.key === "Enter") {
      onSaveModal({ logEntrytype: "Health", values }, modalStateName);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const handleDateTimeChange = (d) => {
    setValues({ ...values, date: d });
  };

  return (
    <Dialog
      fullScreen
      open={openHealthModal}
      onClose={() => onCloseModal(modalStateName)}
      onEnter={handleEnter}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add Meal</DialogTitle>
      <DialogContent>
        <DialogContentText>Great Work! Tell us what you did.</DialogContentText>
        <NativeSelect
          id="healthInfo"
          label="Health Info"
          name="healthInfo"
          fullWidth
          onChange={handleInputChange}>
          <option value="weight">Weight</option>
          <option value="bloodpressure">Blood pressure</option>
          <option value="bmi">BMI</option>
          <option value="pulse">Resting pulse</option>
          <option value="temp">Temperature</option>
        </NativeSelect>
        {values.healthInfo === "weight" && (
          <TextField
            autoFocus
            margin="dense"
            id="weight"
            label="Weight"
            name="weight"
            type="number"
            onChange={handleInputChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">Lbs</InputAdornment>,
              onKeyUp: (e) => onInputKeyUp(e),
            }}
            fullWidth
          />
        )}
        {values.healthInfo === "bloodpressure" && (
          <div>
            <TextField
              autoFocus
              margin="dense"
              id="bpSystolic"
              label="Systolic"
              name="bpSystolic"
              type="number"
              onChange={handleInputChange}
              fullWidth
              inputProps={{
                onKeyUp: (e) => onInputKeyUp(e),
              }}
            />
            <TextField
              margin="dense"
              id="bpDiastolic"
              label="Diastolic"
              name="bpDiastolic"
              type="number"
              onChange={handleInputChange}
              fullWidth
              inputProps={{
                onKeyUp: (e) => onInputKeyUp(e),
              }}
            />
          </div>
        )}
        {values.healthInfo === "bmi" && (
          <TextField
            autoFocus
            margin="dense"
            id="bmi"
            label="BMI"
            name="bmi"
            type="number"
            onChange={handleInputChange}
            fullWidth
            inputProps={{
              onKeyUp: (e) => onInputKeyUp(e),
            }}
          />
        )}
        {values.healthInfo === "pulse" && (
          <TextField
            autoFocus
            margin="dense"
            id="pulse"
            label="Pulse"
            name="pulse"
            type="number"
            onChange={handleInputChange}
            fullWidth
            inputProps={{
              onKeyUp: (e) => onInputKeyUp(e),
            }}
          />
        )}{" "}
        {values.healthInfo === "temp" && (
          <TextField
            autoFocus
            margin="dense"
            id="temp"
            label="Temperature"
            name="temp"
            type="number"
            onChange={handleInputChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">F</InputAdornment>,
              onKeyUp: (e) => onInputKeyUp(e),
            }}
            fullWidth
          />
        )}
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header">
            <Typography>Details</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <DialogContent>
              <Typography>Date</Typography>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DateTimePicker
                  value={values.date}
                  onChange={handleDateTimeChange}
                />
              </MuiPickersUtilsProvider>
            </DialogContent>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onCloseModal(modalStateName)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() =>
            onSaveModal({ logEntrytype: "Health", values }, modalStateName)
          }
          color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
HealthModal.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  onSaveModal: PropTypes.func.isRequired,
  openExerciseModal: PropTypes.bool.isRequired,
  modalStateName: PropTypes.string.isRequired,
};

export default HealthModal;
