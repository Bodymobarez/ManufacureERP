// Load environment variables
if (typeof process !== 'undefined' && process.env) {
  try {
    require('dotenv/config');
  } catch (e) {
    // dotenv not available in serverless environment
  }
}
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { prisma } from "./db";

// Sales routes
import * as salesRoutes from "./routes/sales";

// Production routes
import * as productionRoutes from "./routes/production";

// Inventory routes
import * as inventoryRoutes from "./routes/inventory";

// Quality routes
import * as qualityRoutes from "./routes/quality";

// Procurement routes
import * as procurementRoutes from "./routes/procurement";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Database health check
  app.get("/api/health", async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: "ok", database: "connected" });
    } catch (error) {
      res.status(500).json({ status: "error", database: "disconnected", error: String(error) });
    }
  });

  // Example API routes
  app.get("/api/demo", handleDemo);

  // ==================== SALES ROUTES ====================
  app.get("/api/sales/buyers", salesRoutes.getBuyers);
  app.get("/api/sales/buyers/:id", salesRoutes.getBuyerById);
  app.post("/api/sales/buyers", salesRoutes.createBuyer);
  app.put("/api/sales/buyers/:id", salesRoutes.updateBuyer);
  app.delete("/api/sales/buyers/:id", salesRoutes.deleteBuyer);

  app.get("/api/sales/orders", salesRoutes.getSalesOrders);
  app.get("/api/sales/orders/:id", salesRoutes.getSalesOrderById);
  app.post("/api/sales/orders", salesRoutes.createSalesOrder);
  app.put("/api/sales/orders/:id", salesRoutes.updateSalesOrder);
  app.delete("/api/sales/orders/:id", salesRoutes.deleteSalesOrder);

  // ==================== PRODUCTION ROUTES ====================
  app.get("/api/production/orders", productionRoutes.getProductionOrders);
  app.post("/api/production/orders", productionRoutes.createProductionOrder);
  app.get("/api/production/work-orders", productionRoutes.getWorkOrders);
  app.post("/api/production/work-orders", productionRoutes.createWorkOrder);

  // ==================== INVENTORY ROUTES ====================
  app.get("/api/inventory/warehouses", inventoryRoutes.getWarehouses);
  app.get("/api/inventory/materials", inventoryRoutes.getRawMaterials);
  app.post("/api/inventory/materials", inventoryRoutes.createRawMaterial);
  app.get("/api/inventory/stock", inventoryRoutes.getStockItems);

  // ==================== QUALITY ROUTES ====================
  app.get("/api/quality/inspections", qualityRoutes.getQualityInspections);
  app.post("/api/quality/inspections", qualityRoutes.createQualityInspection);

  // ==================== PROCUREMENT ROUTES ====================
  app.get("/api/procurement/suppliers", procurementRoutes.getSuppliers);
  app.post("/api/procurement/suppliers", procurementRoutes.createSupplier);
  app.get("/api/procurement/orders", procurementRoutes.getPurchaseOrders);
  app.post("/api/procurement/orders", procurementRoutes.createPurchaseOrder);

  return app;
}
