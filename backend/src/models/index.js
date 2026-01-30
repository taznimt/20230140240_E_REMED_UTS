const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  dialect: "mysql",
  logging: false,
  timezone: "+00:00",
});

const Book = require("./book")(sequelize);
const BorrowLog = require("./borrowlog")(sequelize);

// Relations
Book.hasMany(BorrowLog, { foreignKey: "bookId" });
BorrowLog.belongsTo(Book, { foreignKey: "bookId" });

module.exports = { sequelize, Book, BorrowLog };
