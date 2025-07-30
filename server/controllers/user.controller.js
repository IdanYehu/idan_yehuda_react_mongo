
import {userService} from "../services/user.service.js";
import { controllerTryCatch } from '../utils/tryCatch.js';

export const getUsers = controllerTryCatch(async (req, res) => {
    const {age,email,name,city} = req.query;
    const result = await userService.getUsers({age, email, name, city});
    return result;
});

export const userAction = controllerTryCatch(async (req, res) => {
    let result;
    switch(req.method){
        case 'GET':
            result = await userService.getUserById(req.params.id, req.headers.authorization);
            break;
        case 'PUT':
            if(!req.body) {
                throw new Error('No data provided');
            }
            result = await userService.updateUserById(req.params.id, req.body);
            break;
        case 'DELETE':
            result = await userService.deleteUserById(req.params.id);
            break;
        default:
            throw new Error('Method not allowed');
    }
    return result;
});
