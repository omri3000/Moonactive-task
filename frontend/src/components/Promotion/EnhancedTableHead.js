import React from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import PropTypes from "prop-types";
import Checkbox from "@material-ui/core/Checkbox";

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Promotion name"
  },
  { id: "type", numeric: true, disablePadding: false, label: "Type" },
  { id: "startDate", numeric: true, disablePadding: false, label: "Start Date" },
  { id: "endDate", numeric: true, disablePadding: false, label: "End Date" },
  { id: "serGroupName", numeric: true, disablePadding: false, label: "User Group Name" },
  { id: "option", numeric: true, disablePadding: false, label: "Menu" }
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired
};

export default EnhancedTableHead;
