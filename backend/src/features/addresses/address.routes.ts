import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/asyncHandler";
import { validateBody } from "../../shared/middleware/validate";
import { requireAuth } from "../auth";
import {
  createAddressHandler,
  deleteAddressHandler,
  listAddressesHandler,
  setDefaultAddressHandler,
  updateAddressHandler,
} from "./address.controller";
import { addressInputSchema } from "./address.schema";

export const addressRouter = Router();

addressRouter.use(requireAuth);

addressRouter.get("/", asyncHandler(listAddressesHandler));
addressRouter.post("/", validateBody(addressInputSchema), asyncHandler(createAddressHandler));
addressRouter.put("/:id", validateBody(addressInputSchema), asyncHandler(updateAddressHandler));
addressRouter.patch("/:id/default", asyncHandler(setDefaultAddressHandler));
addressRouter.delete("/:id", asyncHandler(deleteAddressHandler));