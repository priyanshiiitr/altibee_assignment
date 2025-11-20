import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateProductQuestions, calculateTransparencyScore } from "./openai";
import { generatePDFReport } from "./pdf";
import { 
  insertProductSchema, 
  answerQuestionSchema,
  type InsertFormResponse,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products API
  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.json({ productId: product.id, product });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid product data" });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const allProducts = await storage.getAllProducts();
      res.json(allProducts);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch product" });
    }
  });

  // Question Generation API
  app.post("/api/questions/generate", async (req, res) => {
    try {
      const { productId } = req.body;
      
      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const questions = await generateProductQuestions(
        product.name,
        product.category,
        product.brand || undefined,
        product.description || undefined
      );

      res.json({ questions });
    } catch (error: any) {
      console.error("Error generating questions:", error);
      res.status(500).json({ error: error.message || "Failed to generate questions" });
    }
  });

  // Form Responses API
  app.post("/api/responses", async (req, res) => {
    try {
      const { productId, responses } = req.body;

      if (!productId || !Array.isArray(responses)) {
        return res.status(400).json({ error: "Invalid request data" });
      }

      // Validate and save each response
      const savedResponses = [];
      for (const response of responses) {
        const validated = answerQuestionSchema.parse(response);
        const formResponse: InsertFormResponse = {
          productId,
          questionId: validated.questionId,
          question: validated.question,
          answer: validated.answer,
          category: validated.category || null,
        };
        const saved = await storage.createFormResponse(formResponse);
        savedResponses.push(saved);
      }

      // Calculate transparency score
      const score = await calculateTransparencyScore(
        responses.map((r: any) => ({
          question: r.question,
          answer: r.answer,
          category: r.category,
        }))
      );

      // Update product with score
      await storage.updateProductScore(productId, score);

      res.json({ success: true, responses: savedResponses, transparencyScore: score });
    } catch (error: any) {
      console.error("Error saving responses:", error);
      res.status(500).json({ error: error.message || "Failed to save responses" });
    }
  });

  app.get("/api/responses/:productId", async (req, res) => {
    try {
      const responses = await storage.getResponsesByProductId(req.params.productId);
      res.json(responses);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch responses" });
    }
  });

  // Reports API
  app.post("/api/reports/generate", async (req, res) => {
    try {
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const responses = await storage.getResponsesByProductId(productId);

      // Create report data
      const reportData = {
        product,
        responses,
        generatedAt: new Date().toISOString(),
      };

      const report = await storage.createReport({
        productId,
        reportData,
        pdfUrl: null,
      });

      res.json({ reportId: report.id, report });
    } catch (error: any) {
      console.error("Error generating report:", error);
      res.status(500).json({ error: error.message || "Failed to generate report" });
    }
  });

  // PDF Download API
  app.get("/api/reports/:productId/pdf", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const responses = await storage.getResponsesByProductId(req.params.productId);
      const htmlReport = generatePDFReport(product, responses);

      res.setHeader("Content-Type", "text/html");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${product.name.replace(/[^a-z0-9]/gi, "-")}-report.html"`
      );
      res.send(htmlReport);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: error.message || "Failed to generate PDF" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
