import express from "express";

// an express middleware used to enable CORS with various options
import cors from "cors";

// an HTTP request logger middleware for node
import logger from "morgan";

// parse incoming request boddies in a middleware before handlers
import bodyParser from "body-parser"; 

// mongodb database
import mongoose from 'mongoose';

// internal imports
import config from "./config.js";
import postsRouter from "./routes/users.js";
//import loggedInRouter from "./routes/loggedIns.js";

const app = express(); // create an express application
const port = 3031; // set port to 3031
const dbUrl = config.dbUrl // db access info

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// dev is a predefined format whereby http output is concise and colored by response 
// status for development use 
app.use(logger("dev"));

var options = {
  keepAlive: 1,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// conect to the db
mongoose.connect(dbUrl, options, (err) => {
  if (err) console.log(err);
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// define the path with a callback middleware that can invoke next
app.use("/posts", postsRouter);
//app.use("/logs", loggedInRouter);

app.listen(port, () => {
  console.log("Runnning on " + port);
});

export default app;
