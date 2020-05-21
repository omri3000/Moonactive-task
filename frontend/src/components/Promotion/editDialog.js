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
  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date(editRow.StartDate));
  const [selectedEndDate, setSelectedEndDate] = React.useState(new Date(editRow.EndDate));

  const handleDateStartChange = (date) => {
    setSelectedStartDate(date);
  };
  const handleDateEndChange = (date) => {
    setSelectedEndDate(date);
  };

  let promotionName = editRow.PromotionName;
  let userGroupName = editRow.UserGroupName;

  const handleSave = () => {
    editRow.PromotionName = promotionName;
    editRow.StartDate = selectedStartDate;
    editRow.EndDate = selectedEndDate;
    editRow.UserGroupName = userGroupName;
    editRow.Type = selected;
    axios
      .put(`http://localhost:4000/row/${editRow._id}`, {
        PromotionName: editRow.PromotionName,
        Type: editRow.Type,
        StartDate: editRow.StartDate,
        EndDate: editRow.EndDate,
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
    setSelected(e.target.value);
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit Row</DialogTitle>
        <DialogContent>
          <Input
            defaultValue={promotionName}
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
          <DatePicker
            startDate={selectedStartDate}
            endDate={selectedEndDate}
            handleDateStartChange={handleDateStartChange}
            handleDateEndChange={handleDateEndChange}
          />
          <Input
            defaultValue={userGroupName}
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
