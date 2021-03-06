import express from "express";
import mongoose, { mongo } from "mongoose";
import bodyParser from "body-parser";
import routes from "./routes/routes";
import cors from "cors";

const app = express();
const PORT = 4000;

// Allow cors
app.use(cors());

//mongo connection
mongoose.Promise = global.Promise;
mongoose
  .connect(
    "mongodb+srv://admin:yOmzIAuw01NvBdrp@mooncluster1-puv1r.mongodb.net/promotionDB?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }
  )
  .catch((e) => console.log(e));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

routes(app);

app.get("/", (req, res) => {
  res.send(`Node app is running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
