import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
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
  let row = props.editRow;
  const [type, setType] = React.useState(row.Type);

  const handleChange = (event) => {
    row.Type = event.target.value;
    setType(event.target.value);
  };
  const handleSave = () => {
    axios
      .put(`http://localhost:4000/row/${row._id}`, {
        PromotionName: row.PromotionName,
        Type: row.Type,
        UserGroupName: row.UserGroupName
      })
      .then((response) => {
        console.log("row", response.data);
        props.closePopup();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="popup">
      <div className="popup_inner">
        <h1>Edit</h1>
        <form className={classes.root} noValidate autoComplete="off">
          {/* <InputLabel id="demo-simple-select-label">Name</InputLabel> */}
          <Input
            defaultValue={row.PromotionName}
            onChange={(e) => (row.PromotionName = e.target.value)}
            inputProps={{ "aria-label": "description" }}
          />
          {/* <InputLabel id="demo-simple-select-label">Type</InputLabel> */}
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            onChange={handleChange}
          >
            <MenuItem value={"Basic"}>Basic</MenuItem>
            <MenuItem value={"Common"}>Common</MenuItem>
            <MenuItem value={"Epic"}>Epic</MenuItem>
          </Select>
          {/* <InputLabel id="demo-simple-select-label">Group Name</InputLabel> */}
          <Input
            defaultValue={row.UserGroupName}
            onChange={(e) => (row.UserGroupName = e.target.value)}
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
