import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import DatePicker from "./DatePicker";
import axios from "axios";

export default function EditDialog(props) {
  const { open, editRow, closePopup } = props;
  const [selected, setSelected] = React.useState(editRow.Type);

  let promotionName = editRow.PromotionName;
  let userGroupName = editRow.userGroupName;
  let type = editRow.Type;

  const handleSave = () => {
    editRow.PromotionName = promotionName;
    editRow.UserGroupName = userGroupName;
    editRow.Type = type;
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

  const handleClose = () => {
    editRow.menu = false;
    closePopup();
  };

  const handleChange = (e) => {
    type = e.target.value;
    setSelected(e.target.value);
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit Row</DialogTitle>
        <DialogContent>
          <Input
            defaultValue={editRow.PromotionName}
            fullWidth
            autoFocus
            onChange={(e) => (promotionName = e.target.value)}
            inputProps={{ "aria-label": "description" }}
          />
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            fullWidth
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
            fullWidth
            autoFocus
            onChange={(e) => (userGroupName = e.target.value)}
            inputProps={{ "aria-label": "description" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
