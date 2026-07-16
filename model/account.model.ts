import mongoose, { Schema } from 'mongoose';


const AccountSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    status :  { type: String, required: true },
    idImg : {
        idFront  :  { type: String, required: true },
        idBack :  { type: String, required: true },
        idSelfie :  { type: String, required: true },
    },
    skills : [{
        skill  :  { type: String, required: true },
        experience :  { type: Number, required: true },
        proficiency :  { type: String, required: true },
    }]
});

export default mongoose.model('Accounts', AccountSchema)