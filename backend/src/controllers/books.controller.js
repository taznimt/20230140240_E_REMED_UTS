const { Book } = require("../models");

function validateBookPayload({ title, author, stock }, isCreate = true) {
  if (isCreate || title !== undefined) {
    if (!title || String(title).trim() === "") return "title tidak boleh kosong";
  }
  if (isCreate || author !== undefined) {
    if (!author || String(author).trim() === "") return "author tidak boleh kosong";
  }
  if (stock !== undefined) {
    const s = Number(stock);
    if (!Number.isInteger(s) || s < 0) return "stock harus integer >= 0";
  }
  return null;
}

exports.getAll = async (req, res, next) => {
  try {
    const books = await Book.findAll({ order: [["id", "ASC"]] });
    res.json(books);
  } catch (e) { next(e); }
};

exports.getById = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const err = validateBookPayload(req.body, true);
    if (err) return res.status(400).json({ message: err });

    const { title, author, stock } = req.body;
    const created = await Book.create({
      title: String(title).trim(),
      author: String(author).trim(),
      stock: stock !== undefined ? Number(stock) : 0
    });

    res.status(201).json(created);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const err = validateBookPayload(req.body, false);
    if (err) return res.status(400).json({ message: err });

    const { title, author, stock } = req.body;

    if (title !== undefined) book.title = String(title).trim();
    if (author !== undefined) book.author = String(author).trim();
    if (stock !== undefined) book.stock = Number(stock);

    await book.save();
    res.json(book);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    await book.destroy();
    res.json({ message: "Deleted" });
  } catch (e) { next(e); }
};
