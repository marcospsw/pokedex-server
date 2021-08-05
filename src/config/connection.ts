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
		console.log('📁📁📁Conexão com o Banco de Dados estabelecida com sucesso!📁📁📁');
	})
	.catch((error) => {
		console.log('Erro ao estabelecer conexão com o Banco de Dados', error);
	});

export default connection;
