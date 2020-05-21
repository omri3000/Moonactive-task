import "date-fns";
import React from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";

export default function DatePicker(props) {
  // The first commit of Material-UI
  let { editRow } = props;
  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date(editRow.StartDate));
  const [selectedEndDate, setSelectedEndDate] = React.useState(new Date(editRow.EndDate));

  const handleDateStartChange = (date) => {
    setSelectedStartDate(date);
  };
  const handleDateEndChange = (date) => {
    setSelectedEndDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Date picker inline"
          value={selectedStartDate}
          onChange={handleDateStartChange}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Date picker dialog"
          format="dd/MM/yyyy"
          value={selectedEndDate}
          onChange={handleDateEndChange}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
