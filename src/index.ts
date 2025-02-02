import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import router from "./router";

require("dotenv").config();

const app = express();
const DB_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(PORT, () => {
   console.log(`SERVER RUNNING ON http://localhost:${PORT}/`);
});

mongoose.Promise = Promise;
mongoose.connect(DB_URL);
mongoose.connection.on("error", (error: Error) => console.log(error.message));

app.use("/", router());
