const Livro = require("../models/Livro");

function tratarErro(res, error) {
  if (error.code === 11000) {
    return res.status(409).json({ mensagem: "Já existe um livro com este ISBN" });
  }
  res.status(400).json({ mensagem: error.message });
}

// ISBN vazio não pode ser salvo como "" (índice único): é removido do documento
function prepararDados(body) {
  const { isbn, ...resto } = body;
  if (isbn === undefined) return { set: resto, unset: {} };
  if (typeof isbn === "string" && isbn.trim() !== "") {
    return { set: { ...resto, isbn: isbn.trim() }, unset: {} };
  }
  return { set: resto, unset: { isbn: 1 } };
}

async function listarLivros(req, res) {
  try {
    const livros = await Livro.find().sort({ createdAt: -1 });
    res.json(livros);
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
}

async function buscarLivro(req, res) {
  try {
    const livro = await Livro.findById(req.params.id);

    if (!livro) {
      return res.status(404).json({ mensagem: "Livro não encontrado" });
    }

    res.json(livro);
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
}

async function criarLivro(req, res) {
  try {
    const { set } = prepararDados(req.body);
    const livro = await Livro.create(set);
    res.status(201).json(livro);
  } catch (error) {
    tratarErro(res, error);
  }
}

async function atualizarLivro(req, res) {
  try {
    const { set, unset } = prepararDados(req.body);
    const update = { $set: set };
    if (Object.keys(unset).length) update.$unset = unset;

    const livro = await Livro.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    });

    if (!livro) {
      return res.status(404).json({ mensagem: "Livro não encontrado" });
    }

    res.json(livro);
  } catch (error) {
    tratarErro(res, error);
  }
}

async function excluirLivro(req, res) {
  try {
    const livro = await Livro.findByIdAndDelete(req.params.id);

    if (!livro) {
      return res.status(404).json({ mensagem: "Livro não encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
}

module.exports = {
  listarLivros,
  buscarLivro,
  criarLivro,
  atualizarLivro,
  excluirLivro
};
