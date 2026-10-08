const mongoose = require("mongoose");

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

module.exports = mongoose.model("Livro", livroSchema);
