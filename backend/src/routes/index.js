const router = require("express").Router();
router.use("/api/books", require("./books.routes"));
router.use("/api/borrow", require("./borrow.routes"));
module.exports = router;
