import express from "express";
import { venderProducto, listarVentas } from "../controllers/ventas.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.post("/ventas/:productId", authRequired, venderProducto);
router.get("/ventas", authRequired, listarVentas);

export default router;
