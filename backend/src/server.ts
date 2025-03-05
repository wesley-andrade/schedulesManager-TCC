import dotenv from "dotenv";
import express from "express";
import router from "./routes/api";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}/`);
});
