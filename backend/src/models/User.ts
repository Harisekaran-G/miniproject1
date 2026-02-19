import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'passenger' | 'operator' | 'taxi';
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true, // Made not required in register? No, User model requires it.
      trim: true,
    },
    role: {
      type: String,
      enum: ['passenger', 'operator', 'taxi'],
      default: 'passenger',
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
// Hash password before saving
// Hash password before saving
UserSchema.pre('save', async function () {
  const user = this as any;
  if (!user.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  } catch (error: any) {
    throw error;
  }
});

export default mongoose.model<IUser>('User', UserSchema);
