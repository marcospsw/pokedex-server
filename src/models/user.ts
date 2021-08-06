import mongoose, { model } from 'mongoose';

export interface User {
	name: string;
	email: string;
	password: string;
	avatar?: string;
}

const UserSchema = new mongoose.Schema<User>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		avatar: { type: String, default: null },
	},
	{
		timestamps: true,
	}
);

const userModel = model<User>('User', UserSchema);

export default userModel;
