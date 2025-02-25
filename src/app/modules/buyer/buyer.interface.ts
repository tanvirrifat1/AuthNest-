import { Types } from 'mongoose';

export type IBUYER = {
  name: string;
  email: string;
  address: string;
  status: 'active' | 'deleted';
  image: string[];
  document: string[];
  phone: string;
  userId: Types.ObjectId;
};
