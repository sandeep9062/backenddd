import mongoose from 'mongoose';

const ContactUSSchema = new mongoose.Schema({ 
    name:{
        type:String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email:{
        type:String,
        required: [true, 'Email is required'],
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    message:{
        type:String,
        required: [true, 'Message is required'],
        minlength: [10, 'Message must be at least 10 characters long']
    }
});

const ContactUS = mongoose.model('ContactUS', ContactUSSchema);
export default ContactUS;
