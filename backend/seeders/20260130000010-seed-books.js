"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("books", [
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        stock: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: "Eloquent JavaScript",
        author: "Marijn Haverbeke",
        stock: 5,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("books", null, {});
  }
};
