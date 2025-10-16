import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
// console.log("Loaded URI:", process.env.MONGODB_URI);
export const dbConnect = async () => {
  await client.connect();
  return client.db("employeedb");
};