// ==================== SALES API ROUTES ====================

import { RequestHandler } from "express";
import { prisma } from "../db";

// Get all buyers
export const getBuyers: RequestHandler = async (_req, res) => {
  try {
    const buyers = await prisma.buyer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(buyers);
  } catch (error) {
    console.error('Error fetching buyers:', error);
    res.status(500).json({ error: 'Failed to fetch buyers' });
  }
};

// Get buyer by ID
export const getBuyerById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const buyer = await prisma.buyer.findUnique({
      where: { id },
      include: {
        salesOrders: true,
        contracts: true,
      },
    });
    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }
    res.json(buyer);
  } catch (error) {
    console.error('Error fetching buyer:', error);
    res.status(500).json({ error: 'Failed to fetch buyer' });
  }
};

// Create buyer
export const createBuyer: RequestHandler = async (req, res) => {
  try {
    const buyer = await prisma.buyer.create({
      data: req.body,
    });
    res.status(201).json(buyer);
  } catch (error) {
    console.error('Error creating buyer:', error);
    res.status(500).json({ error: 'Failed to create buyer' });
  }
};

// Update buyer
export const updateBuyer: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const buyer = await prisma.buyer.update({
      where: { id },
      data: req.body,
    });
    res.json(buyer);
  } catch (error) {
    console.error('Error updating buyer:', error);
    res.status(500).json({ error: 'Failed to update buyer' });
  }
};

// Delete buyer
export const deleteBuyer: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.buyer.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting buyer:', error);
    res.status(500).json({ error: 'Failed to delete buyer' });
  }
};

// Get all sales orders
export const getSalesOrders: RequestHandler = async (_req, res) => {
  try {
    const orders = await prisma.salesOrder.findMany({
      include: {
        buyer: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching sales orders:', error);
    res.status(500).json({ error: 'Failed to fetch sales orders' });
  }
};

// Get sales order by ID
export const getSalesOrderById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.salesOrder.findUnique({
      where: { id },
      include: {
        buyer: true,
        items: true,
      },
    });
    if (!order) {
      return res.status(404).json({ error: 'Sales order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching sales order:', error);
    res.status(500).json({ error: 'Failed to fetch sales order' });
  }
};

// Create sales order
export const createSalesOrder: RequestHandler = async (req, res) => {
  try {
    const { items, ...orderData } = req.body;
    
    const order = await prisma.salesOrder.create({
      data: {
        ...orderData,
        items: {
          create: items || [],
        },
      },
      include: {
        buyer: true,
        items: true,
      },
    });
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating sales order:', error);
    res.status(500).json({ error: 'Failed to create sales order' });
  }
};

// Update sales order
export const updateSalesOrder: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { items, ...orderData } = req.body;
    
    // Delete existing items
    await prisma.salesOrderItem.deleteMany({
      where: { salesOrderId: id },
    });
    
    const order = await prisma.salesOrder.update({
      where: { id },
      data: {
        ...orderData,
        items: {
          create: items || [],
        },
      },
      include: {
        buyer: true,
        items: true,
      },
    });
    
    res.json(order);
  } catch (error) {
    console.error('Error updating sales order:', error);
    res.status(500).json({ error: 'Failed to update sales order' });
  }
};

// Delete sales order
export const deleteSalesOrder: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.salesOrder.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting sales order:', error);
    res.status(500).json({ error: 'Failed to delete sales order' });
  }
};

