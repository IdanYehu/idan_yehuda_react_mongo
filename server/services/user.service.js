
import {userDal}  from "../dal/user.dal.js";
import {verifyToken} from "../utils/token.js";
import {hashPassword} from "../utils/hashPassword.js";

export const userService = {
    getUsers : async (queries) =>{
        try {
            const users = await userDal.getUsers(queries);
            return {
                message: 'Users retrieved successfully',
                users: users
            };
        }catch(e){
            throw  e;
        }
    },
    getUserById : async (id,token) =>{
        try{
           const user =  await userDal.getUserById(id);
            console.log('SERVICE: verifying token',token);
           const res = await verifyToken(token);
            console.log('Service: User retrieved successfully',user);
            console.log('Service: Token verified',res);
            return {
                message:'User retrieved successfully',
                user:user
            }
        }catch(e){
            throw  e;
        }
    },
    updateUserById : async (id,data) =>{
        try{
            delete data.confirmPassword;
            if(data.password){
                data.password = await hashPassword(data.password);
            }
            console.log('SERVICE: Started updating user',id,data);
            const  user = await userDal.updateUserById(id,data);
            console.log('User updated successfully',user);
            return{
                message:'User updated successfully',
                user:user
            }
        }catch(e){
            throw  e;
        }

    },
    deleteUserById : async (id) =>{
        try{
            await userDal.deleteUserById(id);
              return  {message:'User deleted successfully'}
        }catch(e){
            throw  e;
        }
    },
  
}
