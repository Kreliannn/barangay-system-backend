import mongoose, { Schema } from 'mongoose';


const DocumentSchema = new Schema({
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "Accounts", required: true },
    document: { type: String, required: true },
    status: { type: String, required: true },
    isPaid : { type: Boolean, required: true },
    price : { type: Number, required: true },

    fullName : { type: String, required: false },
    contact: { type: String, required: false },
    address: { type: String, required: false },
    dateOfBirth: { type: String, required: false },
    civilStatus: { type: String, required: false },
    nationality: { type: String, required: false }, 
    occupation: { type: String, required: false },
    yrsOfResidency: { type: Number, required: false },
    
    purpose : { type: String, required: false },
    documentNumber : { type: String, required: false },
    dateIssued : { type: String, required: false },

    businessName : { type: String, required: false },
    businessAddress : { type: String, required: false },
    businessType : { type: String, required: false },
    businessNature : { type: String, required: false },


    sqrmtr : { type: Number, required: false },
    partner : { type: String, required: false },
    child : { type: String, required: false },
    Purpose : { type: String, required: false },
    Activity : { type: String, required: false },

    age : { type: Number, required: false },
    monthlyIncome : { type: Number, required: false },
    monthlyExpences : { type: Number, required: false },
});

export default mongoose.model('Documents', DocumentSchema)