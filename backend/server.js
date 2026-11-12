import express from "express"

import dns from 'dns';
import connectDB from "./config/db.js";
import "dotenv/config";
import router from "./routes/auth.js";
import itemRoutes from "./routes/itemRoutes.js";
import cors from "cors"


dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
]);

const app = express();

app.get("/", (req, res) => {
  res.send("API Working");
});

connectDB();

app.use(cors())

const PORT = 4000;

app.use(express.json());
app.use("/api/auth", router);
app.use("/api/items", itemRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(4000, () => {
  console.log("server running on port 4000");
});


