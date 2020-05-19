import express from "express";
import mongoose, { mongo } from "mongoose";
import bodyParser from "body-parser";
import routes from "./routes/routes";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
//mongo connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/promotionDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

routes(app);

// body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send(`Node app is running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
