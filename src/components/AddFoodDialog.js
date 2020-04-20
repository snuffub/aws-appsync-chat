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

const FoodModal = ({
  onCloseModal,
  onSaveModal,
  openFoodModal,
  modalStateName,
}) => {
  const [values, setValues] = useState({
    meal: "Breakfast",
    food: "",
    calories: 0,
    date: new Date(),
  });
  const handleEnter = () => {
    setValues({
      ...values,
      meal: "Breakfast",
      food: "",
      calories: 0,
      date: new Date(),
    });
  };

  const onInputKeyUp = (e) => {
    if (e.key === "Enter") {
      onSaveModal({ logEntrytype: "Food", values }, modalStateName);
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
      open={openFoodModal}
      onClose={() => onCloseModal(modalStateName)}
      onEnter={handleEnter}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add Meal</DialogTitle>
      <DialogContent>
        <DialogContentText>Great Work! Tell us what you did.</DialogContentText>
        <NativeSelect
          id="meal"
          label="Meal"
          name="meal"
          fullWidth
          onChange={handleInputChange}>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </NativeSelect>
        <TextField
          autoFocus
          margin="dense"
          id="food"
          label="Food"
          name="food"
          onChange={handleInputChange}
          fullWidth
          inputProps={{
            onKeyUp: (e) => onInputKeyUp(e),
          }}
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
                  onKeyUp: (e) => onInputKeyUp(e),
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
          onClick={() =>
            onSaveModal({ logEntrytype: "Food", values }, modalStateName)
          }
          color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
FoodModal.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  onSaveModal: PropTypes.func.isRequired,
  openFoodModal: PropTypes.bool.isRequired,
  modalStateName: PropTypes.string.isRequired,
};

export default FoodModal;
