import { Router } from 'express';
import userModel from '../models/user';
import bcrypt from 'bcryptjs';
import * as yup from 'yup';
import AuthMidleware from '../midlewares/AuthMidleware';
import { config } from '../config/auth';
import jwt from 'jsonwebtoken';

const userRouter = Router();

userRouter.post('/', async (req, res) => {
	let schema = yup.object().shape({
		name: yup.string().required(),
		email: yup.string().required().email(),
		password: yup.string().required().min(8),
		passwordConfirmation: yup
			.string()
			.required()
			.oneOf([yup.ref('password')]),
		avatar: yup.string().nullable(),
	});

	if (!(await schema.isValid(req.body))) {
		return res.status(400).json({
			error: true,
			message: 'Cadastro Invalido!',
		});
	}

	let userExist = await userModel.findOne({ email: req.body.email });
	if (userExist) {
		return res.status(400).json({
			error: true,
			message: 'Usuário ja cadastrado!',
		});
	}

	try {
		const { name, email, password, avatar } = req.body;

		const user = new userModel({
			name,
			email,
			password,
			avatar,
		});
		user.password = await bcrypt.hash(user.password, 8);

		await user.save();

		user.password = undefined;

		return res.status(200).json({
			error: false,
			user,
		});
	} catch (error) {
		return res.status(500).json({
			error: true,
			message: error,
		});
	}
});

userRouter.get('/exists', async (req, res) => {
	const user = req.query.userEmail.toString();
	let userExist = await userModel.findOne({ email: user });

	if (userExist) {
		return res.status(200).json(true);
	}

	return res.status(200).json(false);
});

userRouter.get('/', async (req, res) => {
	const users = await userModel.find();

	const usersArray = users.map((user) => ({ name: user.name, email: user.email }));

	return res.status(200).json({
		error: false,
		usersArray,
	});
});

userRouter.post('/edit', AuthMidleware, async (req, res) => {
	let schema = yup.object().shape({
		id: yup.string().required(),
		name: yup.string().required(),
		email: yup.string().required().email(),
		oldPassword: yup.string().required(),
		newPassword: yup.string(),
		newPasswordConfirmation: yup.string().oneOf([yup.ref('newPassword')]),
		avatar: yup.string().nullable(),
	});

	if (!(await schema.isValid(req.body))) {
		return res.status(400).json({
			error: true,
			message: 'Edição Invalida!',
		});
	}

	const { id, name, email, oldPassword, newPassword, avatar } = req.body;
	const user = await userModel.findOne({ _id: id });
	let userExist = await userModel.findOne({ email });
	if (userExist && userExist.email !== user.email) {
		return res.status(400).json({
			error: true,
			message: 'E-mail ja cadastrado!',
		});
	}

	if (!(await bcrypt.compare(oldPassword, user.password))) {
		return res.status(400).json({
			error: true,
			message: 'Senha incorreta!',
		});
	}

	const password = newPassword ? await bcrypt.hash(newPassword, 8) : await bcrypt.hash(oldPassword, 8);

	await userModel.updateOne({ _id: id }, { name, email, password, avatar });
	const newUser = await userModel.findOne({ _id: id });

	newUser.password = undefined;

	const tokenUser = {
		id: newUser._id,
		name: newUser.name,
		email: newUser.email,
		avatar: newUser.avatar,
	};

	const token = jwt.sign(tokenUser, config.secret, { expiresIn: config.expiresIn });

	return res.status(200).json({
		error: false,
		user: newUser,
		token,
	});
});

export default userRouter;
