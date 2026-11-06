import { Router } from "express";
import {
  getServices,
  getServicesById,
  createService,
  updateService,
  deleteService
} from "../controllers/services.controller.js"

const router = Router();

router.get("/", getServices);

router.get("/:sid", getServicesById);

router.post("/", createService);

router.put("/:sid", updateService);

router.delete("/:sid", deleteService);

export default router;
