import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";
import { dbConnect } from "./db.js";

const PORT = process.env.PORT
import dotenv from "dotenv";
dotenv.config();


async function startServer() {
  try {
    const db = await dbConnect();
    console.log(" Connected to MongoDB");

    
   

    
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,  
    });

    const { url } = await server.listen({ port: PORT });
    console.log(`Server ready at ${url}`);
  } catch (err) {
    console.error(" Server error:", err);
    process.exit(1);
  }
}

startServer();