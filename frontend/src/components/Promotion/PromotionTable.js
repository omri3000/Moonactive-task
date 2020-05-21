import React, { useEffect, useRef, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import QueueIcon from "@material-ui/icons/Queue";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import EditDialog from "./editDialog";
// import EditPopup from "./EditPopup";

// makeStyles from material-UI
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  container: {
    maxHeight: "70vh"
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));

export default function EnhancedTable() {
  const classes = useStyles();
  // checkbox state
  const [selected, setSelected] = React.useState([]);
  // rows in table state
  const [rows, setRows] = React.useState([]);
  // row object to edit state
  const [editableRow, setEditableRow] = React.useState({});
  // pagination number state
  const [page, setPage] = React.useState(0);
  // check if has more rows to load below
  const [hasMoreBelow, setHasMoreBelow] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  // if scroll up
  const [hasMoreAbove, setHasMoreAbove] = React.useState(false);
  // edit popup state show/hide
  // const [showPopup, setShowPopup] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  // scroll position top/down
  // eslint-disable-next-line
  const [scrollPosition, setSrollPosition] = React.useState(0);

  // handle scroll check if the side of the scrolling is up or down and set the hasMoreAbove
  const handleScroll = () => {
    const position = window.pageYOffset;
    setSrollPosition((prevPosition) => {
      console.log(prevPosition);
      console.log(position);
      if (prevPosition < position) {
        setHasMoreAbove(false);
      } else {
        console.log(position);
        setHasMoreAbove(true);
      }
      return position;
    });
  };

  // scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line
  }, []);

  const observerLastRow = useRef();
  const observerFirstRow = useRef();
  // callback run when last row is visible
  const lastRow = useCallback(
    (node) => {
      if (observerLastRow.current) observerLastRow.current.disconnect();
      observerLastRow.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreBelow) {
          setPage((prevPage) => {
            if (Number(prevPage) === 0) {
              return prevPage + 3;
            } else {
              return prevPage + 1;
            }
          });
        }
      });
      if (node) observerLastRow.current.observe(node);
    },
    [hasMoreBelow]
  );

  // callback run when first row is visible
  const firstRow = useCallback((node) => {
    if (observerFirstRow.current) observerFirstRow.current.disconnect();
    observerFirstRow.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => {
          if (prevPage - 3 < 0) {
            return 0;
          }
          return prevPage - 3;
        });
      }
    });
    if (node) observerFirstRow.current.observe(node);
  }, []);

  const handleSelected = () => {
    setSelected([]);
  };
  //set all to selected or unselected
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  // selected on row
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };
  // open action menu
  const handleMenu = (event, row) => {
    event.stopPropagation();
    rows.map((row) => (row.menu = false));
    row.menu = true;
    setSelected([]);
  };
  // open action menu
  const closeHandle = (event, row) => {
    event.stopPropagation();
    row.menu = false;
    setSelected([]);
  };
  // on click delete on row delete the row
  const deleteHandle = (event, row) => {
    event.stopPropagation();
    axios
      .delete(`http://localhost:4000/row/${row._id}`)
      .then((response) => {
        var elm = document.getElementById(row._id);
        elm.remove();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // on click edit open popup with form to edit
  const editHandle = (event, row) => {
    event.stopPropagation();
    setEditableRow(row);
    // togglePopup(row);
    setOpen(true);
  };
  // on click duplicate create another row in the database and show on table
  const copyHandle = (event, row) => {
    event.stopPropagation();
    const index = rows.map((row) => row._id).indexOf(row._id);
    axios
      .put(`http://localhost:4000/duplicateRow/${row._id}`, {})
      .then((response) => {
        const arr = [...rows.slice(0, index + 1), response.data, ...rows.slice(index + 1)];
        setRows(arr);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // show/hide popup
  const closePopup = () => {
    setOpen(false);
  };

  // any change on the page call for more rows from the DB max row on DOM 90
  useEffect(() => {
    setLoading(true);
    let numberOfRows = 30;
    if (Number(page) === 0) {
      numberOfRows = 90;
    }
    let url = `http://localhost:4000/getRows/${page}/${numberOfRows}`;
    axios
      .get(url)
      .then((response) => {
        setHasMoreBelow(response.data.length > 0);
        if (page < 0) return;
        if (hasMoreAbove) {
          setRows((prevRows) => {
            let newRows;
            if (Number(page) === 0) {
              newRows = response.data;
            } else {
              newRows = response.data.concat(prevRows.slice(0, prevRows.length - 15));
            }
            return newRows;
          });
        } else {
          setRows((prevRows) => {
            let newRows = prevRows.slice(numberOfRows, prevRows.length).concat(response.data);
            return newRows;
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line
  }, [page]);

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <div className={classes.root}>
      {/* {showPopup ? (
        <EditPopup text="Close Me" editRow={editableRow} closePopup={togglePopup} />
      ) : null} */}
      {open ? <EditDialog open={open} editRow={editableRow} closePopup={closePopup} /> : ""}
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          selectedFun={handleSelected}
        />
        <TableContainer className={classes.container}>
          <Table
            className={`${classes.table} ${loading ? "stop-scrolling" : ""}`}
            aria-labelledby="tableTitle"
            size={"small"}
            aria-label="enhanced table"
            stickyHeader
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row._id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row._id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row._id}
                    selected={isItemSelected}
                    ref={
                      rows.length === index + 1
                        ? lastRow
                        : Number(index) === 20 && Number(page) !== 0
                        ? firstRow
                        : undefined
                    }
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.PromotionName}
                    </TableCell>
                    <TableCell align="right">{row.Type}</TableCell>
                    <TableCell align="right">
                      {new Date(row.StartDate).toJSON().slice(0, 10).split("-").reverse().join("/")}
                    </TableCell>
                    <TableCell align="right">
                      {new Date(row.EndDate).toJSON().slice(0, 10).split("-").reverse().join("/")}
                    </TableCell>
                    <TableCell align="right">{row.UserGroupName}</TableCell>
                    <TableCell align="right">
                      {row.menu ? (
                        <div>
                          <Tooltip title="Duplicate">
                            <IconButton
                              onClick={(event) => copyHandle(event, row)}
                              aria-label="duplicate"
                            >
                              <QueueIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={(event) => editHandle(event, row)}
                              aria-label="edit"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={(event) => deleteHandle(event, row)}
                              aria-label="delete"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Close">
                            <IconButton
                              onClick={(event) => closeHandle(event, row)}
                              aria-label="close"
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      ) : (
                        <MoreVertIcon
                          className="menu-style"
                          onClick={(event) => handleMenu(event, row)}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {loading ? <div className="loading-block">Loading...</div> : null}
    </div>
  );
}
