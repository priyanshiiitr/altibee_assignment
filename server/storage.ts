// Database storage implementation following the javascript_database blueprint
import { 
  products, 
  formResponses, 
  reports,
  type Product, 
  type InsertProduct,
  type FormResponse,
  type InsertFormResponse,
  type Report,
  type InsertReport,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Products
  createProduct(product: InsertProduct): Promise<Product>;
  getProduct(id: string): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  updateProductScore(id: string, score: number): Promise<void>;

  // Form Responses
  createFormResponse(response: InsertFormResponse): Promise<FormResponse>;
  getResponsesByProductId(productId: string): Promise<FormResponse[]>;

  // Reports
  createReport(report: InsertReport): Promise<Report>;
  getReportByProductId(productId: string): Promise<Report | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Products
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getAllProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(desc(products.createdAt));
  }

  async updateProductScore(id: string, score: number): Promise<void> {
    await db
      .update(products)
      .set({ transparencyScore: score })
      .where(eq(products.id, id));
  }

  // Form Responses
  async createFormResponse(insertResponse: InsertFormResponse): Promise<FormResponse> {
    const [response] = await db
      .insert(formResponses)
      .values(insertResponse)
      .returning();
    return response;
  }

  async getResponsesByProductId(productId: string): Promise<FormResponse[]> {
    return db
      .select()
      .from(formResponses)
      .where(eq(formResponses.productId, productId));
  }

  // Reports
  async createReport(insertReport: InsertReport): Promise<Report> {
    const [report] = await db
      .insert(reports)
      .values(insertReport)
      .returning();
    return report;
  }

  async getReportByProductId(productId: string): Promise<Report | undefined> {
    const [report] = await db
      .select()
      .from(reports)
      .where(eq(reports.productId, productId));
    return report || undefined;
  }
}

export const storage = new DatabaseStorage();
