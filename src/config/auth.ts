import 'dotenv/config';
export const config = {
	secret: process.env.TOKEN_SECRET,
	expiresIn: process.env.TOKEN_EXPIRES,
};
