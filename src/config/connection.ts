import moongose from 'mongoose';

const connection = moongose
	.connect('mongodb+srv://admin:admin@pokedexdatabase.tu8um.mongodb.net/pokedex-database?retryWrites=true&w=majority', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => {
		console.log('Conexão com o Banco de Dados estabelecida com sucesso!');
	})
	.catch((error) => {
		console.log('Erro ao estabelecer conexão com o Banco de Dados', error);
	});

export default connection;
