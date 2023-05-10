import { Schema, model } from 'mongoose';
import { IAdverse } from '../utils/types';

const adverseSchema = new Schema<IAdverse>(
    {
        name: {
            type: String,
            required: true
          },
        status: {
          type: String,
          required: true
        },
        pre_notice_date: {
          type: Date,
          required: true
        },
        post_notice_date:{
         type:Date,
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

export default model<IAdverse>('Adverse', adverseSchema);
