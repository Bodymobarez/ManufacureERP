// ==================== PRODUCTION API ROUTES ====================

import { RequestHandler } from "express";
import { prisma } from "../db";

// Get all production orders
export const getProductionOrders: RequestHandler = async (_req, res) => {
  try {
    const orders = await prisma.productionOrder.findMany({
      include: {
        workOrders: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching production orders:', error);
    res.status(500).json({ error: 'Failed to fetch production orders' });
  }
};

// Create production order
export const createProductionOrder: RequestHandler = async (req, res) => {
  try {
    const order = await prisma.productionOrder.create({
      data: req.body,
    });
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating production order:', error);
    res.status(500).json({ error: 'Failed to create production order' });
  }
};

// Get all work orders
export const getWorkOrders: RequestHandler = async (_req, res) => {
  try {
    const workOrders = await prisma.workOrder.findMany({
      include: {
        productionOrder: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(workOrders);
  } catch (error) {
    console.error('Error fetching work orders:', error);
    res.status(500).json({ error: 'Failed to fetch work orders' });
  }
};

// Create work order
export const createWorkOrder: RequestHandler = async (req, res) => {
  try {
    const workOrder = await prisma.workOrder.create({
      data: req.body,
      include: {
        productionOrder: true,
      },
    });
    res.status(201).json(workOrder);
  } catch (error) {
    console.error('Error creating work order:', error);
    res.status(500).json({ error: 'Failed to create work order' });
  }
};

