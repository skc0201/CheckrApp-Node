import { Schema, model } from 'mongoose';
import { IAddress } from '../utils/types';

const addressSchema = new Schema<IAddress>(
  {
    houseNo: {
      type: String,
      required: true
    },
    streetNo: {
      type: String,
      required: true
    },
    city: {
        type: String,
        required: true
      },
    state: {
        type: String,
        required: true
      },
    pincode: {
        type: String,
        required: true
      },
  },
);

export default model<IAddress>('Address', addressSchema);
