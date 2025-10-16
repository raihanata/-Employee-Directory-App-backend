import { ObjectId } from "mongodb";
import { DBRef } from "mongodb";
import { dbConnect } from "./db.js";

export const resolvers = {
    
    Query:{
     getAllEmployees :async()=>{

        const db=await dbConnect()
        const docs= await db.collection("employees").find({}).toArray()
        return docs.map((d)=>({
          id:d._id.toString(),
          name:d.name,
          position:d.position,
          department:d.department,
          salary:d.salary

        }))


     },
      getEmployeeDetails:async(_, { id })=>{
        if (!ObjectId.isValid(id)) throw new Error("Invalid id");
        const db = await dbConnect()
        console.log(id)
        const empId = new ObjectId(id)
       const d = await db.collection("employees").findOne({_id: empId});
        if (!d) return null;
      return {
        id: d._id.toString(),
        name: d.name,
        position: d.position,
        department: d.department,
        salary: d.salary,
      };
      },
       getEmployeesByDepartment:async(_,{department})=>{
   
      const db = await dbConnect();
      const docs = await db.collection("employees").find({department}).toArray();
    
      return docs.map(d => ({
        id: d._id.toString(),
        name: d.name,
        position: d.position,
        department: d.department,
        salary: d.salary,
      }));
    
       }
    },
    Mutation:{

        addEmployee:async(_,{name,position,department,salary}) => {

          console.log(name, position, department, salary)
         if (!name || !position || !department || typeof salary !== "number" || !Number.isInteger(salary)) {
         throw new Error("Invalid input");
        }
        const db = await dbConnect();
        const newDoc = { name, position, department, salary };
        const res = await db.collection("employees").insertOne(newDoc);
        
        return {
            id: res.insertedId.toString(),
            ...newDoc
        };
        },
        updateEmployee: async (_,  { id, name, position, department, salary }) => {
         
            
            if (!ObjectId.isValid(id)) throw new Error("Invalid id");
            const db = await dbConnect();
            const update = {};
            if (name !== undefined) update.name = name;
            if (position !== undefined) update.position = position;
            if (department !== undefined) update.department = department;
            if (salary !== undefined) update.salary = salary;

            if (Object.keys(update).length === 0) {
                throw new Error("No fields to update");
            }

            const empId = new ObjectId(id)
            const result = await db.collection("employees").findOneAndUpdate(
                { _id: empId },
                { $set: update },
                { returnDocument: 'after' }
            );

            console.log(result)

            const d = result;
            if (!d) throw new Error("Employee not found");

            return {
                id: d._id.toString(),
                name: d.name,
                position: d.position,
                department: d.department,
                salary: d.salary
            };
    },
    deleteEmployee: async (_, { id }) => {
      if (!ObjectId.isValid(id)) throw new Error("Invalid id");
      const db = await dbConnect();
      const res = await db.collection("employees").deleteOne({ _id: new ObjectId(id) });
      return res.deletedCount === 1;
    } 

    },
    
}