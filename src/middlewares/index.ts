import express, { NextFunction } from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../db/users";

export const isOwner = (req: express.Request, res: express.Response, next: express.NextFunction) => {
   const { id } = req.params;
   const currentUserId = get(req, "identity._id") as string;

   if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
   }
   next();
};

export const isAuthenticated = async (req: express.Request, res: express.Response, next: NextFunction) => {
   //   Get token from cookies using the cookie name
   const sessionToken = req.cookies["kunta"];

   // Check if cookie exist
   if (!sessionToken) {
      return res.sendStatus(403);
   }

   // Now we check if a user has this session token in our db
   const userExist = await getUserBySessionToken(sessionToken);

   if (!userExist) {
      return res.sendStatus(403);
   }

   merge(req, { identity: userExist });

   next();
};
