import mongoose from 'mongoose';


const connectDb = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to mongo db database ${conn.connection.host}`)
    }
    catch(error){
        console.log(`Error is : ${error}`)
    }
};

// const User = new mongoose.Schema({
//     name :{type:String,required:true},
//     email:{type:String,required:true},
//     password:{type:String,required:true}
// },
//     {collection:'user-data'}
// )

// const model = mongoose.model('UserData',User);
export default connectDb;
// module.exports =model;
