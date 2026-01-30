require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

const PORT = Number(process.env.PORT || 3000);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (e) {
    console.error("Failed to start:", e);
    process.exit(1);
  }
})();
