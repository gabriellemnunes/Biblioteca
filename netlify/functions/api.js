const serverless = require("serverless-http");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const livroRoutesModule = require("../../src/routes/livroRoutes");
const livroRoutes = livroRoutesModule.default || livroRoutesModule;

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

app.use("/api/livros", livroRoutes);

module.exports.handler = serverless(app);