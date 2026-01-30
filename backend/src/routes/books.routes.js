const router = require("express").Router();
const books = require("../controllers/books.controller");
const { requireRole } = require("../middlewares/role.middleware");

// Public
router.get("/", books.getAll);
router.get("/:id", books.getById);

// Admin
router.post("/", requireRole("admin"), books.create);
router.put("/:id", requireRole("admin"), books.update);
router.delete("/:id", requireRole("admin"), books.remove);

module.exports = router;
