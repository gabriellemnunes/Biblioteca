import dns from "node:dns";
import dotenv from "dotenv";
import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import livroRoutes from "./routes/livroRoutes.js";

dns.setServers(["8.8.4.4"]);

dotenv.config();

const app = express();

app.use(cors());
app.use(json());

app.get("/", (req, res) => {
  res.json({ mensagem: "API da Biblioteca funcionando" });
});

app.use("/livros", livroRoutes);

const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/biblioteca";

connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  });