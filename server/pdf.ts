import type { Product, FormResponse } from "@shared/schema";

// Simple PDF generation - in production, you'd use a library like PDFKit or Puppeteer
// For now, we'll create an HTML-based report that can be printed to PDF
export function generatePDFReport(
  product: Product,
  responses: FormResponse[]
): string {
  const categoryScores = responses.reduce((acc, response) => {
    const category = response.category || "General";
    if (!acc[category]) {
      acc[category] = { total: 0, count: 0 };
    }
    const score = Math.min(100, (response.answer.length / 10) * 10);
    acc[category].total += score;
    acc[category].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const categoryData = Object.entries(categoryScores).map(([category, data]) => ({
    category,
    score: Math.round(data.total / data.count),
  }));

  // Generate HTML that can be converted to PDF
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Product Transparency Report - ${product.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 3px solid #059669;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      font-size: 32px;
      font-weight: 700;
      color: #059669;
      margin-bottom: 8px;
    }
    .meta {
      color: #666;
      font-size: 14px;
    }
    .score-section {
      background: #f0fdf4;
      border: 2px solid #059669;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
      text-align: center;
    }
    .score {
      font-size: 48px;
      font-weight: 700;
      color: #059669;
    }
    .score-label {
      color: #666;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .category-scores {
      margin: 30px 0;
    }
    .category-score {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-bottom: 1px solid #e5e5e5;
    }
    .category-name {
      font-weight: 600;
    }
    .category-value {
      font-weight: 700;
      color: #059669;
    }
    .section {
      margin: 30px 0;
    }
    h2 {
      font-size: 24px;
      color: #1a1a1a;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e5e5;
    }
    .response {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    .question {
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 8px;
    }
    .answer {
      color: #4a4a4a;
      padding-left: 16px;
      white-space: pre-wrap;
    }
    .badge {
      display: inline-block;
      background: #e5e5e5;
      color: #666;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      margin-left: 8px;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    @media print {
      body { padding: 20px; }
      .score-section { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${product.name}</h1>
    <div class="meta">
      ${product.brand ? `<strong>${product.brand}</strong> • ` : ''}
      ${product.category}
      ${product.description ? `<br>${product.description}` : ''}
    </div>
  </div>

  <div class="score-section">
    <div class="score-label">Overall Transparency Score</div>
    <div class="score">${product.transparencyScore || 'N/A'}${product.transparencyScore ? '%' : ''}</div>
  </div>

  ${categoryData.length > 0 ? `
  <div class="category-scores">
    <h2>Category Breakdown</h2>
    ${categoryData.map(cat => `
      <div class="category-score">
        <span class="category-name">${cat.category}</span>
        <span class="category-value">${cat.score}%</span>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="section">
    <h2>Detailed Information</h2>
    ${responses.map(response => `
      <div class="response">
        <div class="question">
          ${response.question}
          ${response.category ? `<span class="badge">${response.category}</span>` : ''}
        </div>
        <div class="answer">${response.answer}</div>
      </div>
    `).join('')}
  </div>

  <div class="footer">
    <p>Product Transparency Report</p>
    <p>Generated on ${new Date(product.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}</p>
    <p>Report ID: ${product.id}</p>
  </div>
</body>
</html>
  `;

  return html;
}
