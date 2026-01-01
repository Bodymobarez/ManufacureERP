// ==================== QUALITY API ROUTES ====================

import { RequestHandler } from "express";
import { prisma } from "../db";

// Get all quality inspections
export const getQualityInspections: RequestHandler = async (_req, res) => {
  try {
    const inspections = await prisma.qualityInspection.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(inspections);
  } catch (error) {
    console.error('Error fetching quality inspections:', error);
    res.status(500).json({ error: 'Failed to fetch quality inspections' });
  }
};

// Create quality inspection
export const createQualityInspection: RequestHandler = async (req, res) => {
  try {
    const inspection = await prisma.qualityInspection.create({
      data: req.body,
    });
    res.status(201).json(inspection);
  } catch (error) {
    console.error('Error creating quality inspection:', error);
    res.status(500).json({ error: 'Failed to create quality inspection' });
  }
};

