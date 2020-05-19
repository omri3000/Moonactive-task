import {
  addNewRows,
  getAllRows,
  removeAllRows,
  deleteRowById,
  updateRowById,
  duplicateRow,
  getNumOfRows
} from "../controllers/promotionCtrl";

const routes = (app) => {
  app.route("/newRows/:numberOfRows").get(addNewRows);
  app.route("/allRows").get(getAllRows).delete(removeAllRows);
  app.route("/row/:id").put(updateRowById).delete(deleteRowById);
  app.route("/duplicateRow/:id").put(duplicateRow);
  app.route("/getRows/:page").get(getNumOfRows);
};

export default routes;
