import express from "express";
import { Router } from 'express';
import stripeWebhookController from '../controllers/stripeWebhookController.js';

const router = Router();
router.post('/update-order',express.raw({ type: 'application/json' }),stripeWebhookController.updateOrder);

export default router;