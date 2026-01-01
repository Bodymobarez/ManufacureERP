// ==================== PROCUREMENT API ROUTES ====================

import { RequestHandler } from "express";
import { prisma } from "../db";

// Get all suppliers
export const getSuppliers: RequestHandler = async (_req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
};

// Create supplier
export const createSupplier: RequestHandler = async (req, res) => {
  try {
    const supplier = await prisma.supplier.create({
      data: req.body,
    });
    res.status(201).json(supplier);
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: 'Failed to create supplier' });
  }
};

// Get all purchase orders
export const getPurchaseOrders: RequestHandler = async (_req, res) => {
  try {
    const orders = await prisma.purchaseOrder.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ error: 'Failed to fetch purchase orders' });
  }
};

// Create purchase order
export const createPurchaseOrder: RequestHandler = async (req, res) => {
  try {
    const order = await prisma.purchaseOrder.create({
      data: req.body,
    });
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({ error: 'Failed to create purchase order' });
  }
};

