import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import DatePicker from "./DatePicker";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
    }
  }
}));

export default function EditPopup(props) {
  const classes = useStyles();
  let { editRow } = props;
  const [selected, setSelected] = React.useState(editRow.Type);

  // on click update the row in the db and close the pop up
  const handleSave = () => {
    axios
      .put(`http://localhost:4000/row/${editRow._id}`, {
        PromotionName: editRow.PromotionName,
        Type: editRow.Type,
        UserGroupName: editRow.UserGroupName
      })
      .then((response) => {
        props.closePopup();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    editRow.Type = e.target.value;
    setSelected(e.target.value);
  };
  return (
    <div className="popup">
      <div className="popup_inner">
        <h1>Edit</h1>
        <form className={classes.root} noValidate autoComplete="off">
          <Input
            defaultValue={editRow.PromotionName}
            onChange={(e) => (editRow.PromotionName = e.target.value)}
            inputProps={{ "aria-label": "description" }}
          />
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selected}
            onChange={(e) => handleChange(e)}
          >
            <MenuItem value={"Basic"}>Basic</MenuItem>
            <MenuItem value={"Common"}>Common</MenuItem>
            <MenuItem value={"Epic"}>Epic</MenuItem>
          </Select>
          <DatePicker editRow={editRow} />
          <Input
            defaultValue={editRow.UserGroupName}
            onChange={(e) => (editRow.UserGroupName = e.target.value)}
            inputProps={{ "aria-label": "description" }}
          />
        </form>
        <div className="form-buttons">
          <button onClick={props.closePopup}>cancel</button>
          <button onClick={handleSave}>save</button>
        </div>
      </div>
    </div>
  );
}
