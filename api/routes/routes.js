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
  app.route("/newRows/:numberOfRows").get(addNewRows);
  app.route("/allRows").get(getAllRows).delete(removeAllRows);
  app.route("/row/:id").get(getRowById).put(updateRowById).delete(deleteRowById);
  app.route("/duplicateRow/:id").put(duplicateRow);
  app.route("/getRows/:page/:rows").get(getNumOfRows);
  app.route("/deleteByArray").post(deleteByArray);
};

export default routes;
