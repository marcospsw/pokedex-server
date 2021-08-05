import { request, Router } from 'express';
import userModel from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/auth';

const loginRouter = Router();

loginRouter.post('/', async (req, res) => {
	const { email, password } = req.body;

	const user = await userModel.findOne({ email });

	if (!user) {
		return res.status(400).json({
			error: true,
			message: 'Usuário não existe!',
		});
	}

	if (!(await bcrypt.compare(password, user.password))) {
		return res.status(400).json({
			error: true,
			message: 'Senha incorreta!',
		});
	}

	const tokenUser = {
		id: user._id,
		name: user.name,
		email: user.email,
		avatar: user.avatar,
	};

	const token = jwt.sign(tokenUser, config.secret, { expiresIn: config.expiresIn });

	return res.status(200).json({
		error: false,
		user: {
			name: user.name,
			email: user.email,
			avatar: user.avatar,
		},
		token,
	});
});

export default loginRouter;
