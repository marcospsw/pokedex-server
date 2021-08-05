import { Router } from 'express';
import userModel from '../models/user';
import bcrypt from 'bcryptjs';
import * as yup from 'yup';
import AuthMidleware from '../midlewares/AuthMidleware';

const userRouter = Router();

userRouter.post('/', async (req, res) => {
	let schema = yup.object().shape({
		name: yup.string().required(),
		email: yup.string().required().email(),
		password: yup.string().required().min(8),
		avatar: yup.string().required(),
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

userRouter.get('/', AuthMidleware, async (req, res) => {
	const users = await userModel.find();

	return res.status(200).json({
		error: false,
		users,
	});
});

export default userRouter;
