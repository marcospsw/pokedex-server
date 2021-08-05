import 'dotenv/config';
export const config = {
	secret: process.env.SECRET,
	expiresIn: process.env.TOKEN_EXPIRES,
};
