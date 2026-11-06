import { Router } from "express";
import {
  getBookingByID,
  createBooking,
  addServiceToBooking
} from "../controllers/bookings.controller.js"

const router = Router();

router.get("/:bid", getBookingByID);

router.post("/", createBooking);

router.post("/:bid/services/:sid", addServiceToBooking);

export default router;
