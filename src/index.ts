import connectDB from "../config/dbconnection";
import express from "express";
import user from "./routes/user";
import addmember from "./routes/addmember";
import schedule from "./routes/schedule";
import vaccinated from "./routes/vaccinated";
import vaccinecenter from "./routes/vaccinecenter";
import fetchcitystate from "./routes/fetchcitystate";
import cronroute from "./routes/cronroute";
import axios from "axios";
const bodyParser = require("body-parser");
const cron = require('node-cron');
const app = express();
require("dotenv").config();

//connect to db
connectDB();

// Express configuration
app.set("port", process.env.PORT || 4000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/cowid-19', user);
app.use('/cowid-19', addmember);
app.use('/cowid-19', schedule);
app.use('/cowid-19', vaccinated);
app.use('/cowid-19', vaccinecenter);
app.use('/cowid-19', fetchcitystate);
app.use('/cowid-19', cronroute);

app.get("/", (_req, res) => {
  res.send("API Running");
});

cron.schedule('* * 2 * *', () => {
  console.log("cron job");
  // axios.post(`http://127.0.0.1:${port}/cowid-19/delete`).then(function (response) {
  //   console.log(response);
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });
});

const port: number = app.get("port");
const server: object = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;