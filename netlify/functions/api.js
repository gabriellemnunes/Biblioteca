const serverless = require("serverless-http");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   CONEXÃO COM O MONGODB
========================= */

let conexao;

async function conectarBanco() {
  if (conexao) {
    return conexao;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI não configurada no Netlify");
  }

  conexao = await mongoose.connect(uri);

  return conexao;
}

/* =========================
   MODEL LIVRO
========================= */

const livroSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "O título é obrigatório"],
      trim: true
    },

    autor: {
      type: String,
      required: [true, "O autor é obrigatório"],
      trim: true
    },

    isbn: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },

    genero: {
      type: String,
      trim: true
    },

    anoPublicacao: {
      type: Number,
      min: [0, "Ano inválido"]
    },

    lido: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Livro =
  mongoose.models.Livro ||
  mongoose.model("Livro", livroSchema);

/* =========================
   PREPARAR DADOS
========================= */

function prepararDados(body) {
  const { isbn, ...resto } = body;

  if (isbn === undefined) {
    return {
      set: resto,
      unset: {}
    };
  }

  if (typeof isbn === "string" && isbn.trim() !== "") {
    return {
      set: {
        ...resto,
        isbn: isbn.trim()
      },
      unset: {}
    };
  }

  return {
    set: resto,
    unset: {
      isbn: 1
    }
  };
}

/* =========================
   ROTA TESTE
========================= */

app.get("/api", (req, res) => {
  res.json({
    mensagem: "API da Biblioteca funcionando"
  });
});

/* =========================
   LISTAR LIVROS
========================= */

app.get("/api/livros", async (req, res) => {
  try {
    await conectarBanco();

    const livros = await Livro.find().sort({
      createdAt: -1
    });

    res.json(livros);
  } catch (error) {
    console.error("Erro ao listar livros:", error);

    res.status(500).json({
      mensagem: "Erro ao listar livros",
      erro: error.message
    });
  }
});

/* =========================
   BUSCAR LIVRO
========================= */

app.get("/api/livros/:id", async (req, res) => {
  try {
    await conectarBanco();

    const livro = await Livro.findById(req.params.id);

    if (!livro) {
      return res.status(404).json({
        mensagem: "Livro não encontrado"
      });
    }

    res.json(livro);
  } catch (error) {
    console.error("Erro ao buscar livro:", error);

    res.status(400).json({
      mensagem: error.message
    });
  }
});

/* =========================
   CRIAR LIVRO
========================= */

app.post("/api/livros", async (req, res) => {
  try {
    await conectarBanco();

    const { set } = prepararDados(req.body);

    const livro = await Livro.create(set);

    res.status(201).json(livro);
  } catch (error) {
    console.error("Erro ao criar livro:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        mensagem: "Já existe um livro com este ISBN"
      });
    }

    res.status(400).json({
      mensagem: error.message
    });
  }
});

/* =========================
   ATUALIZAR LIVRO
========================= */

app.put("/api/livros/:id", async (req, res) => {
  try {
    await conectarBanco();

    const { set, unset } = prepararDados(req.body);

    const update = {
      $set: set
    };

    if (Object.keys(unset).length) {
      update.$unset = unset;
    }

    const livro = await Livro.findByIdAndUpdate(
      req.params.id,
      update,
      {
        new: true,
        runValidators: true
      }
    );

    if (!livro) {
      return res.status(404).json({
        mensagem: "Livro não encontrado"
      });
    }

    res.json(livro);
  } catch (error) {
    console.error("Erro ao atualizar livro:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        mensagem: "Já existe um livro com este ISBN"
      });
    }

    res.status(400).json({
      mensagem: error.message
    });
  }
});

/* =========================
   EXCLUIR LIVRO
========================= */

app.delete("/api/livros/:id", async (req, res) => {
  try {
    await conectarBanco();

    const livro = await Livro.findByIdAndDelete(
      req.params.id
    );

    if (!livro) {
      return res.status(404).json({
        mensagem: "Livro não encontrado"
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir livro:", error);

    res.status(400).json({
      mensagem: error.message
    });
  }
});

/* =========================
   NETLIFY
========================= */

module.exports.handler = serverless(app);