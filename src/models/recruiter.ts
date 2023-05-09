import { Schema, model } from 'mongoose';
import { IRecruiter } from '../utils/types';

const recruiterSchema = new Schema<IRecruiter>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    company:{
     type:String,
     required:true
    },
    phone:{
        type:String,
        required:true
    },
  },
  { timestamps: true }
);

export default model<IRecruiter>('Recruiter', recruiterSchema);
