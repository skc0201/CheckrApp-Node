import { Schema, model } from 'mongoose';
import { IReport } from '../utils/types';

const reportSchema = new Schema<IReport>(
  {
    status: {
      type: String,
      required: true
    },
    adjudication: {
      type: String,
      required: true
    },
    completedAt: {
      type: Date,
      required: true
    },
    tat:{
     type:String,
     required:true
    },
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate',
      required:true
    }
  },
  { timestamps: true }
);

export default model<IReport>('Report', reportSchema);
