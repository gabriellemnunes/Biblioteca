const express = require("express");
const livroController = require("../controllers/livroController");

const router = express.Router();

router.get("/", livroController.listarLivros);
router.get("/:id", livroController.buscarLivro);
router.post("/", livroController.criarLivro);
router.put("/:id", livroController.atualizarLivro);
router.delete("/:id", livroController.excluirLivro);

module.exports = router;
