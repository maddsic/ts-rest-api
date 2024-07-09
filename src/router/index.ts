import express from "express";
import authRoute from "./authRoute";
import usersRoute from "./usersRoute";

const router = express.Router();

export default (): express.Router => {
   authRoute(router);
   usersRoute(router);
   return router;
};
