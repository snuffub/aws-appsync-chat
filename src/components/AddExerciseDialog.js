import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
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

const ExerciseModal = ({
  onCloseModal,
  onSaveModal,
  openExerciseModal,
  modalStateName
}) => {
  const [values, setValues] = useState({
    activity: "run",
    distance: 0,
    date: new Date(),
    duration: 0,
    calories: 0
  });
  const handleEnter = () => {
    setValues({
      ...values,
      activity: "run",
      distance: 0,
      date: new Date(),
      duration: 0,
      calories: 0
    });
  };

  const onInputKeyUp = e => {
    if (e.key === "Enter") {
      onSaveModal(values, modalStateName);
    }
  };
  const handleInputChange = e => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const handleDateTimeChange = d => {
    setValues({ ...values, date: d });
  };

  return (
    <Dialog
      fullScreen
      open={openExerciseModal}
      onClose={() => onCloseModal(modalStateName)}
      onEnter={handleEnter}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add Activity</DialogTitle>
      <DialogContent>
        <DialogContentText>Great Work! Tell us what you did.</DialogContentText>
        <NativeSelect
          id="activity"
          label="Activity"
          name="activity"
          fullWidth
          onChange={handleInputChange}>
          <option value="run">Run</option>
          <option value="bike">Bike</option>
          <option value="swim">Swim</option>
          <option value="yoga">Yoga</option>
        </NativeSelect>
        {values.activity !== "yoga" && (
          <TextField
            autoFocus
            margin="dense"
            id="distance"
            type="number"
            label="Distance"
            name="distance"
            onChange={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">Miles</InputAdornment>
              ),
              onKeyUp: e => onInputKeyUp(e)
            }}
            fullWidth
          />
        )}
        <TextField
          margin="dense"
          id="duration"
          type="number"
          label="Duration"
          name="duration"
          onChange={handleInputChange}
          InputProps={{
            endAdornment: <InputAdornment position="end">Min</InputAdornment>,
            onKeyUp: e => onInputKeyUp(e)
          }}
          fullWidth
        />
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

              <TextField
                autoFocus
                margin="dense"
                id="calories"
                type="number"
                label="Calories"
                name="calories"
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Cal</InputAdornment>
                  ),
                  onKeyUp: e => onInputKeyUp(e)
                }}
                fullWidth
              />
            </DialogContent>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onCloseModal(modalStateName)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => onSaveModal(values, modalStateName)}
          color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
ExerciseModal.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  onSaveModal: PropTypes.func.isRequired,
  openExerciseModal: PropTypes.bool.isRequired,
  modalStateName: PropTypes.string.isRequired
};

export default ExerciseModal;
