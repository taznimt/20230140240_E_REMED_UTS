const { sequelize, Book, BorrowLog } = require("../models");

function validateBorrowPayload({ bookId, latitude, longitude }) {
  const b = Number(bookId);
  if (!Number.isInteger(b) || b <= 0) return "bookId harus integer > 0";

  const lat = Number(latitude);
  const lon = Number(longitude);
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) return "latitude tidak valid";
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) return "longitude tidak valid";

  return null;
}

exports.borrow = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const err = validateBorrowPayload(req.body);
    if (err) {
      await t.rollback();
      return res.status(400).json({ message: err });
    }

    const { bookId, latitude, longitude } = req.body;

    const book = await Book.findByPk(bookId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!book) {
      await t.rollback();
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.stock <= 0) {
      await t.rollback();
      return res.status(400).json({ message: "Stok buku habis" });
    }

    book.stock = book.stock - 1;
    await book.save({ transaction: t });

    const log = await BorrowLog.create(
      {
        userId: req.userId,
        bookId: book.id,
        latitude: Number(latitude),
        longitude: Number(longitude),
        borrowDate: new Date()
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({
      message: "Borrow success",
      book: { id: book.id, title: book.title, stock: book.stock },
      borrowLog: log
    });
  } catch (e) {
    await t.rollback();
    next(e);
  }
};
