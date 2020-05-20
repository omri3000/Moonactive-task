import {
  addNewRows,
  getAllRows,
  removeAllRows,
  deleteRowById,
  updateRowById,
  duplicateRow,
  getNumOfRows,
  getRowById,
  deleteByArray
} from "../controllers/promotionCtrl";

const routes = (app) => {
  app
    .route("/newRows/:numberOfRows")
    // Create rows to db with parameter "numberOfRows"
    .get(addNewRows);

  app
    .route("/allRows")
    // get all the rows in the db table
    .get(getAllRows)
    // delete all the rows in the db table
    .delete(removeAllRows);

  app
    .route("/row/:id")
    // get specific row by Id
    .get(getRowById)
    // update row by Id
    .put(updateRowById)
    // delete row by Id
    .delete(deleteRowById);

  app
    .route("/duplicateRow/:id")
    // duplicate row with another Id
    .put(duplicateRow);

  app
    .route("/getRows/:page/:rows")
    // pagination get page number and the number of rows
    .get(getNumOfRows);

  app
    .route("/deleteByArray")
    // Delete multiple rows
    .post(deleteByArray);
};

export default routes;
