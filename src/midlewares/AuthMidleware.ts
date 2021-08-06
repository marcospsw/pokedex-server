import jwt from 'jsonwebtoken';
import { config } from '../config/auth';

const AuthMidleware = async (req, res, next) => {
	const auth = req.headers.authorization;

	if (!auth) {
		return res.status(401).json({
			error: true,
			code: 130,
			message: 'Token não existe!',
		});
	}

	const [, token] = auth.split(' ');

	try {
		const decoded: any = jwt.verify(token, config.secret);

		if (!decoded) {
			return res.status(401).json({
				error: true,
				code: 130,
				message: 'Token expirado!',
			});
		} else if (decoded.id !== req.body.id) {
			return res.status(401).json({
				error: true,
				code: 130,
				message: 'Erro de token!',
			});
		} else {
			req.user_id = decoded.id;
			next();
		}
	} catch (error) {
		return res.status(401).json({
			error: true,
			code: 130,
			message: 'Token invalido!',
		});
	}
};

export default AuthMidleware;
