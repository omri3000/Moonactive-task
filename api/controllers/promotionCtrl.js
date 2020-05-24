import mongoose from "mongoose";
import fs from "fs";
import { PromotionSchema } from "../schema/promotionSchema";

const Rows = mongoose.model("promotion", PromotionSchema);

//read json file with example of data save them as the number the user request or 1 default
export const addNewRows = (req, res) => {
  fs.readFile("./json/rows.json", "utf8", function (err, data) {
    if (err) throw err;
    const json = JSON.parse(data);
    const insertLength = req.params.numberOfRows ? req.params.numberOfRows : 1;
    let arr = [];
    for (let i = 0; i < insertLength; i++) {
      let j = { ...json };
      j.PromotionName = "Sale" + (i + 1);
      arr.push(j);
    }
    Rows.insertMany(arr)
      .then(function (docs) {
        res.json({ message: `uploaded ${insertLength} rows` });
      })
      .catch(function (err) {
        console.log(err);
      });
  });
};

// delete Row by Id
export const deleteRowById = (req, res) => {
  Rows.deleteMany({ _id: req.params.id }, (err, Row) => {
    if (err) {
      res.send(err);
    }
    res.json(Row);
  });
};

// delete multiple rows
export const deleteByArray = (req, res) => {
  Rows.deleteMany({ _id: req.body.id }, (err, Row) => {
    if (err) {
      res.send(err);
    }
    res.json(Row);
  });
};

// get row by id
export const getRowById = (req, res) => {
  Rows.findById(req.params.id, (err, Row) => {
    if (err) {
      res.send(err);
    }
    res.json(Row);
  });
};

// update row by id
export const updateRowById = (req, res) => {
  Rows.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, Row) => {
    if (err) {
      res.send(err);
    }

    res.json(Row);
  });
};

// duplicate row by id
export const duplicateRow = (req, res) => {
  Rows.findById(req.params.id).exec(function (err, doc) {
    doc._id = mongoose.Types.ObjectId();
    doc.isNew = true;
    doc.save(() => {
      res.json(doc);
    });
  });
};

// get all row in the db table
export const getAllRows = (req, res) => {
  var query = Rows.find({}).stream();
  let newCount = 0;
  let jsonObj = [];
  query
    .on("data", function (doc) {
      ++newCount;
      jsonObj.push(doc);
    })
    .on("error", function (err) {
      console.log(err);
    })
    .on("close", function (doc) {
      console.log("close");
      console.log(`count : ${newCount}`);
      res.json(jsonObj);
    });
};

// pagination get page number and the number of rows
export const getNumOfRows = (req, res) => {
  const pageNumber = req.params.page;
  let perPage = req.params.rows ? parseInt(req.params.rows) : 15,
    page = Math.max(0, pageNumber);

  Rows.find()
    .limit(perPage)
    .skip(perPage * page)
    .exec(function (err, rows) {
      if (err) {
        res.json(err);
      }
      res.json(rows);
    });
};

//remove all rows from the db table
export const removeAllRows = (req, res) => {
  Rows.deleteMany({}, (err, Rows) => {
    if (err) {
      res.send(err);
    }
    res.json(Rows);
  });
};
