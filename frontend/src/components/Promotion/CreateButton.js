import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1)
  }
}));

export default function CreateButton(props) {
  const classes = useStyles();

  // create row on the DB can insert difference number set to 10,000
  const createRows = () => {
    const numberOfRows = 10000;
    axios
      .get(`http://localhost:4000/newRows/${numberOfRows}`)
      .then((res) => {
        window.location.reload();
        return;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="ab">
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        endIcon={<Icon>send</Icon>}
        onClick={() => {
          createRows();
        }}
      >
        Create 10,000 Rows
      </Button>
    </div>
  );
}
