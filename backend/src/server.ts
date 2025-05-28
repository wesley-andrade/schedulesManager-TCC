import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}/`);
});
