import React from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import KitchenOutlinedIcon from "@material-ui/icons/KitchenOutlined";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";

function LogItemFood(props) {
  return (
    <ListItem alignItems="flex-start">
      {props.content && (
        <ListItemAvatar>
          <Avatar>
            <KitchenOutlinedIcon />
          </Avatar>
        </ListItemAvatar>
      )}
      {props.content.values && (
        <ListItemText
          primary={props.content.values.meal}
          secondary={
            <React.Fragment>
              <Typography component="span" variant="body2" color="textPrimary">
                {props.content.values.food}
              </Typography>
            </React.Fragment>
          }
        />
      )}
    </ListItem>
  );
}

function LogItemExercise(props) {
  return (
    <ListItem alignItems="flex-start">
      {props.content && (
        <ListItemAvatar>
          <Avatar>
            <FitnessCenterIcon />
          </Avatar>
        </ListItemAvatar>
      )}
      {props.content.values && (
        <ListItemText
          primary={props.content.values.activity}
          secondary={
            <React.Fragment>
              <Typography component="span" variant="body2" color="textPrimary">
                {props.content.values.distance +
                  " miles " +
                  " in " +
                  props.content.values.duration +
                  " minutes"}
              </Typography>
            </React.Fragment>
          }
        />
      )}
    </ListItem>
  );
}

function LogItemHealth(props) {
  return (
    <ListItem alignItems="flex-start">
      {props.content && (
        <ListItemAvatar>
          <Avatar>
            <LocalHospitalIcon />
          </Avatar>
        </ListItemAvatar>
      )}
      {props.content.values && (
        <ListItemText
          primary={props.content.values.healthInfo}
          secondary={
            <React.Fragment>
              <Typography component="span" variant="body2" color="textPrimary">
                {props.content.values.weight + " lbs"}
              </Typography>
            </React.Fragment>
          }
        />
      )}
    </ListItem>
  );
}

export { LogItemFood, LogItemExercise, LogItemHealth };
