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
import EditPopup from "./EditPopup";

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
  const [selected, setSelected] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [editableRow, setEditableRow] = React.useState({});
  const [page, setPage] = React.useState(0);
  const [hasMoreBelow, setHasMoreBelow] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);
  const [hasMoreAbove, setHasMoreAbove] = React.useState(false);
  const [scrollPosition, setSrollPosition] = React.useState(0);

  let updatedData = true;

  const handleScroll = () => {
    const position = window.pageYOffset;
    setSrollPosition((prevPosition) => {
      if (prevPosition < position) {
        setHasMoreAbove(false);
      } else {
        setHasMoreAbove(true);
      }
      return position;
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const observer = useRef();
  const observer2 = useRef();
  const lastRow = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreBelow) {
          updatedData = false;
          setPage((prevPage) => {
            if (prevPage == 0) {
              return prevPage + 4;
            } else {
              return prevPage + 1;
            }
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMoreBelow]
  );

  const firstRow = useCallback((node) => {
    if (observer2.current) observer2.current.disconnect();
    observer2.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        updatedData = false;
        setPage((prevPage) => {
          if (prevPage - 4 < 0) {
            return 0;
          }
          return prevPage - 4;
        });
      }
    });
    if (node) observer2.current.observe(node);
  }, []);

  const handleSelected = () => {
    setSelected([]);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
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
  const handleMenu = (event, row) => {
    event.stopPropagation();
    rows.map((row) => (row.menu = false));
    row.menu = true;
    setSelected([]);
  };
  const closeHandle = (event, row) => {
    event.stopPropagation();
    row.menu = false;
    setSelected([]);
  };
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
  const editHandle = (event, row) => {
    event.stopPropagation();
    setEditableRow(row);
    togglePopup(row);
  };
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
  const togglePopup = (row) => {
    if (row) {
      row.menu = false;
    }
    setShowPopup((p) => !p);
  };

  useEffect(() => {
    let numberOfRows = 25;
    if (page == 0) {
      numberOfRows = 100;
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
            if (page == 0) {
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
        updatedData = true;
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page]);

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <div className={classes.root}>
      {showPopup ? (
        <EditPopup text="Close Me" editRow={editableRow} closePopup={togglePopup} />
      ) : null}
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          selectedFun={handleSelected}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"small"}
            aria-label="enhanced table"
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
                      rows.length - 15 === index + 1 && updatedData
                        ? lastRow
                        : index == 20 && page != 0 && updatedData
                        ? firstRow
                        : undefined
                    }
                  >
                    {/* {rows.length - 15 === index + 1 && updatedData
                      ? console.log("rowPromotionName", row.PromotionName)
                      : index == 15 && page != 0 && updatedData
                      ? console.log("rowPromotionName", row.PromotionName)
                      : undefined} */}
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
    </div>
  );
}
