import mongoose from "mongoose";
import fs from "fs";
import { PromotionSchema } from "../schema/promotionSchema";

const Rows = mongoose.model("promotion", PromotionSchema);

export const addNewRows = (req, res) => {
  fs.readFile("./json/rows.json", "utf8", function (err, data) {
    if (err) throw err;
    var json = JSON.parse(data);
    const insertLength = req.params.numberOfRows ? req.params.numberOfRows : 1;
    for (let i = 0; i < insertLength; i++) {
      json.PromotionName = "Sale" + (i + 1);
      let newRows = new Rows(json);
      newRows.save((err, Rows) => {
        if (err) {
          res.send(err);
        }
      });
    }
    res.json({ message: `uploaded ${insertLength} rows` });
  });
};

export const deleteRowById = (req, res) => {
  Rows.deleteMany({ _id: req.params.id }, (err, Row) => {
    if (err) {
      res.send(err);
    }
    res.json(Row);
  });
};

export const deleteByArray = (req, res) => {
  Rows.deleteMany({ _id: req.body.id }, (err, Row) => {
    if (err) {
      res.send(err);
    }
    res.json(Row);
  });
};

export const getRowById = (req, res) => {
  Rows.findById(req.params.id, (err, Row) => {
    if (err) {
      res.send(err);
    }
    res.json(Row);
  });
};

export const updateRowById = (req, res) => {
  Rows.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, Row) => {
    if (err) {
      res.send(err);
    }

    res.json(Row);
  });
};

export const duplicateRow = (req, res) => {
  Rows.findById(req.params.id).exec(function (err, doc) {
    doc._id = mongoose.Types.ObjectId();
    doc.isNew = true;
    doc.save(() => {
      res.json(doc);
    });
  });
};

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

export const removeAllRows = (req, res) => {
  Rows.deleteMany({}, (err, Rows) => {
    if (err) {
      res.send(err);
    }
    res.json(Rows);
  });
};
