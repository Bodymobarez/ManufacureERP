// ==================== INVENTORY API ROUTES ====================

import { RequestHandler } from "express";
import { prisma } from "../db";

// Get all warehouses
export const getWarehouses: RequestHandler = async (_req, res) => {
  try {
    const warehouses = await prisma.warehouse.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(warehouses);
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    res.status(500).json({ error: 'Failed to fetch warehouses' });
  }
};

// Get all raw materials
export const getRawMaterials: RequestHandler = async (_req, res) => {
  try {
    const materials = await prisma.rawMaterial.findMany({
      include: {
        stockItems: {
          include: {
            warehouse: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(materials);
  } catch (error) {
    console.error('Error fetching raw materials:', error);
    res.status(500).json({ error: 'Failed to fetch raw materials' });
  }
};

// Create raw material
export const createRawMaterial: RequestHandler = async (req, res) => {
  try {
    const material = await prisma.rawMaterial.create({
      data: req.body,
    });
    res.status(201).json(material);
  } catch (error) {
    console.error('Error creating raw material:', error);
    res.status(500).json({ error: 'Failed to create raw material' });
  }
};

// Get stock items
export const getStockItems: RequestHandler = async (_req, res) => {
  try {
    const stockItems = await prisma.stockItem.findMany({
      include: {
        material: true,
        warehouse: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(stockItems);
  } catch (error) {
    console.error('Error fetching stock items:', error);
    res.status(500).json({ error: 'Failed to fetch stock items' });
  }
};

