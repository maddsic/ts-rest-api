import express from "express";
import { createUser, deleteUserById, getUserByEmail, getUserById, getUsers, updateUser } from "../db/users";
import { createRandomSalt, hashPassword } from "helpers";

export const CreateUsers = async (req: express.Request, res: express.Response) => {
   const { username, email, password } = req.body;

   if (!username || !email || !password) {
      return res.sendStatus(400);
   }

   try {
      const userExist = await getUserByEmail(email);

      if (userExist) {
         return res.sendStatus(400).json({
            success: false,
            message: "User with this email already exists",
         });
      }

      const salt = createRandomSalt();

      const user = await createUser({
         username,
         email,
         password: hashPassword(salt, password),
      });

      return res.status(200).json({
         success: true,
         message: "user created successfully",
         data: user,
      });
   } catch (error) {
      console.log("Error creating user", error);
      return res.sendStatus(400);
   }
};

/**
 * @path /users
 * @param none
 * @returns all users
 */
export const getAllUsers = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
   try {
      const user = await getUsers();

      if (!user) {
         return res.status(404).send("User not found");
      }

      return res.status(200).json(user);
   } catch (error) {
      console.log("ERROR - ", error.message);
      return res.sendStatus(500);
   }
};

/**
 * @path /users/:id
 * @param id
 * @returns a updated user
 */
export const update = async (req: express.Request, res: express.Response) => {
   const { id } = req.params;
   const { username } = req.body;

   if (!username) {
      return res.sendStatus(403);
   }

   try {
      const user = await getUserById(id);

      if (!user) {
         return res.sendStatus(400);
      }

      user.username = username;
      await user.save();

      return res.status(200).json(user).end();
   } catch (error) {
      console.log("ERROR - ", error);
      return res.sendStatus(400);
   }
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
   const { id } = req.params;

   const deletedUser = await deleteUserById(id);

   return res
      .status(200)
      .json({
         success: true,
         message: "user deleted successfully",
         user: deletedUser,
      })
      .end();
};
