import bcrypt from "bcrypt"

//2 functions
// 1: hashing the password , 2: compare and decrypt

export const hashPassword = async(password) => {
    try{
        const saltRounds = 10;  
        const hashedPassword = bcrypt.hash(password,saltRounds);
        return hashedPassword
    }
    catch(error){
        console.log(error)
    }
};

export const comparePassword = async(password,hashedPassword) => {
    return bcrypt.compare(password,hashedPassword)
};

