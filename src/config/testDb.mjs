import { Sequelize } from "sequelize";

// Cấu hình Sequelize theo file config.json
const sequelize = new Sequelize("hoidanIT", "root", null, {
  host: "127.0.0.1",
  dialect: "mysql",
});

let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối MySQL thành công!");
  } catch (error) {
    console.error("❌ Lỗi kết nối:", error);
  } finally {
    await sequelize.close();
  }
}

export default connectDB;
