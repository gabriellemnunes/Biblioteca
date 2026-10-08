import serverless from "serverless-http";
import dotenv from "dotenv";
import express, { json } from "express";
import cors from "cors";
import { connect } from "mongoose";
import livroRoutes from "../../src/routes/livroRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(json());

let conexao;

app.use(async (req, res, next) => {
  try {
    if (!conexao) {
      conexao = connect(process.env.MONGODB_URI);
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

app.get("/", (req, res) => {
  res.json({ mensagem: "API da Biblioteca funcionando" });
});

app.use("/livros", livroRoutes);