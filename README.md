# API Biblioteca (CRUD de Livros)

Node.js + Express + Mongoose + MongoDB Atlas.

## Executar localmente

```bash
npm install
cp .env.example .env   # edite MONGODB_URI com a sua string do Atlas
npm run dev
```

## Rotas

| Método | Rota | Ação |
|---|---|---|
| GET | /livros | Lista livros |
| GET | /livros/:id | Busca um livro |
| POST | /livros | Cria um livro |
| PUT | /livros/:id | Atualiza um livro |
| DELETE | /livros/:id | Exclui um livro |

## Exemplo de JSON

```json
{
  "titulo": "Dom Casmurro",
  "autor": "Machado de Assis",
  "isbn": "9788535910663",
  "genero": "Romance",
  "anoPublicacao": 1899,
  "lido": true
}
```

## Deploy no Render

- New + > Web Service > conecte este repositório
- Build Command: `npm install`
- Start Command: `npm start`
- Environment: variável `MONGODB_URI` com a string do Atlas
- No Atlas: Network Access > permitir `0.0.0.0/0`
