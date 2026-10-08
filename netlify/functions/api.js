const serverless = require("serverless-http");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const controllerModule = require("../../src/controllers/livroController");
const livroController = controllerModule.default || controllerModule;

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let conexao;

app.use(async (req, res, next) => {
  try {
    if (!conexao) {
      conexao = mongoose.connect(process.env.MONGODB_URI);
    }

    await conexao;
    next();
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);

    res.status(500).json({
      mensagem: "Erro ao conectar ao banco de dados"
    });
  }
});

app.get("/api", (req, res) => {
  res.json({
    mensagem: "API da Biblioteca funcionando"
  });
});

app.get("/api/livros", livroController.listarLivros);
app.get("/api/livros/:id", livroController.buscarLivro);
app.post("/api/livros", livroController.criarLivro);
app.put("/api/livros/:id", livroController.atualizarLivro);
app.delete("/api/livros/:id", livroController.excluirLivro);

module.exports.handler = serverless(app);