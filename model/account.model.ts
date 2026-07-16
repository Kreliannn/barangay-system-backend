import mongoose, { Schema } from 'mongoose';


const AccountSchema = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
});

export default mongoose.model('Accounts', AccountSchema)