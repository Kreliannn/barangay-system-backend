import mongoose, { Schema } from 'mongoose';


const AccountSchema = new Schema({
    profile: { type: String, required: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },

    gender: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    civilStatus: { type: String, required: true },
    purok: { type: String, required: true },
    voterStatus: { type: String, required: true },
    houseHoldNumber: { type: String, required: true },

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
        availability :  { type: String, required: true },
        services :  [{ type: String, required: true }],
    }],
    reviews : [{
        user :   { type: String, required: true },
        userProfile : { type: String, required: true },
        star  :  { type: Number, required: true },
        skill :  { type: String, required: true },
        message :  { type: String, required: true },
    }],
});

export default mongoose.model('Accounts', AccountSchema)