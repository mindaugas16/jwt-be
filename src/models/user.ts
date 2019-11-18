import { Document, model, Schema } from 'mongoose';


export interface UserInterface extends Document{
    _doc: any;
    _id: any;
    email: string;
    password: string;
}

const userSchema = new Schema({
   email: {
       type: String,
       required: true,
       unique: true
   },
    password: {
       type: String,
        required: true
    },
});

export default model<UserInterface>('User', userSchema);
