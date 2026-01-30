const router = require("express").Router();
const borrow = require("../controllers/borrow.controller");
const { requireRole, requireUserId } = require("../middlewares/role.middleware");

router.post("/", requireRole("user"), requireUserId, borrow.borrow);

module.exports = router;
