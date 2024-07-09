import express from "express";
import { createUser, getUserByEmail } from "../db/users";
import { hashPassword, createRandomSalt } from "../helpers";

/**
 * @ Login route
 * @path /auth/login
 * */
export const login = async (req: express.Request, res: express.Response) => {
   const { email, password } = req.body;

   if (!email || !password) {
      return res.sendStatus(400);
   }

   const user = await getUserByEmail(email).select("+authentication.salt +authentication.password");

   if (!user) {
      return res.sendStatus(400);
   }

   const expectedPassword = hashPassword(user?.authentication?.salt, password);
   // console.log(expectedPassword);

   if (user.authentication.password !== expectedPassword) {
      return res.sendStatus(403);
   }

   const salt = createRandomSalt();
   user.authentication.sessionToken = hashPassword(salt, user._id.toString());

   // save user in database
   await user.save();

   // passing cookies
   res.cookie("kunta", user.authentication.sessionToken, { domain: "localhost" });

   return res.status(200).json(user).end();
};

/**
 * @ Register route
 * @path /auth/register
 * */
export const register = async (req: express.Request, res: express.Response) => {
   const { username, email, password } = req.body;

   try {
      if (!username || !email || !password) {
         return res.sendStatus(400);
      }

      const userExist = await getUserByEmail(email);

      if (userExist) {
         return res.sendStatus(400);
      }

      const salt = createRandomSalt();
      const user = await createUser({
         email,
         username,
         authentication: {
            salt,
            password: hashPassword(salt, password),
         },
      });

      return res.status(200).json(user).end();
   } catch (error) {
      console.log(error);
      return res.sendStatus(400);
   }
};
