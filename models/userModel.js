import mongoose from 'mongoose';

//name of schema : user
const User = new mongoose.Schema({
    name :{type:String,required:true,trim:true},
    email:{type:String,required:true,unique:true},
    address:{type:{},required:true},
    phone:{type:String,required:true},
    password:{type:String,required:true},
    answer:{type:String,required:true},
    role:{type:Number,default:0}
},
{timestamps:true,
   collection: 'user-datas'
})   //timestamp: when a new users creates account, the created time will be added

//since we have already created a collection using atlas
//user-data: name of the collection
export default mongoose.model('user-datas',User);
