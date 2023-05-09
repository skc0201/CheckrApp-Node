import { Schema, model } from 'mongoose';
import { ICourtSearch, ICourtSearches, IRecruiter } from '../utils/types';

const courtSearchSchema = new Schema<ICourtSearch>({
  status: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required:true
  }
});

const courtSearchesSchema = new Schema<ICourtSearches>(
  {
    ssn_verification: {
      type: courtSearchSchema,
      required: true
    },
    sex_offender: {
      type: courtSearchSchema,
      required: true
    },
    global_watchlist: {
      type: courtSearchSchema,
      required: true
    },
    federal_criminal:{
     type:courtSearchSchema,
     required:true
    },
    country_criminal:{
        type:courtSearchSchema,
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

export default model<ICourtSearches>('CourtSearch', courtSearchesSchema);
