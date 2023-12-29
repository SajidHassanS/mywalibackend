require("dotenv").config();
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const router = require("./src/router");
const passport = require("passport");
const session = require("express-session");
const express = require("express");
const cors = require("cors");
const errorController = require("./src/utils/errorController");
const AppError = require("./src/utils/appError");
const logger = require("morgan");

const { clouddebugger } = require("googleapis/build/src/apis/clouddebugger");
const { io } = require("./src/utils/socket");


require("./src/utils/database");
require("./src/utils/passport");

const app = express();
const server = http.createServer(app);
io.attach(server ,{
  cors: "*"
});


app.use(cors());
app.use(passport.initialize());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.session());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(router);
app.all("*", (req, res, next) => {
  throw new AppError(`Requested Url not found!`, 404);
});
app.use(errorController);

const PORT = process.env.PORT;
server.listen(PORT, function () {
  console.log(`Server running on  *:${PORT} Process  ${process.pid} `);
});
