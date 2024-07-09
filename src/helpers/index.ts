import crypto from "crypto";
import bcrypt from "bcrypt";

export const createRandomSalt = () => crypto.randomBytes(128).toString("base64");
export const hashPassword = (salt: string, password: string) => {
   return crypto.createHmac("sha256", [salt, password].join("/")).update(process.env.SECRET_KEY).digest("hex");
};

// export const hashPassword = async (salt: string, password: string): Promise<string> => {
//    const saltRounds = 10; // You can adjust the number of salt rounds as needed
//    const combinedPassword = [salt, password].join("/");
//    const hashedPassword = await bcrypt.hash(combinedPassword, saltRounds);
//    return hashedPassword;
// };
