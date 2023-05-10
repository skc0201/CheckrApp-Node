import { Schema, model } from 'mongoose';
import { ICandidate } from '../utils/types';

const candidateSchema = new Schema<ICandidate>(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    contact:{
     type:String,
     required:true
    },
    license:{
        type:String,
        required:true
    },
    DOB:{
        type:Date,
        required:true
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
      required:true
    }
  },
  { timestamps: true }
);

export default model<ICandidate>('Candidate', candidateSchema);
