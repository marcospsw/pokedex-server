import moongose from 'mongoose';
import 'dotenv/config';

const connection = moongose
	.connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => {
		console.log('๐๐๐Conexรฃo com o Banco de Dados estabelecida com sucesso!๐๐๐');
	})
	.catch((error) => {
		console.log('Erro ao estabelecer conexรฃo com o Banco de Dados', error);
	});

export default connection;
