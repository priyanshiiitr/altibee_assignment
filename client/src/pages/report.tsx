import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Navbar } from "@/components/navbar";
import { TransparencyChart } from "@/components/transparency-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, ArrowLeft, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import type { Product, FormResponse } from "@shared/schema";

export default function ReportPage() {
  const [, params] = useRoute("/report/:id");
  const productId = params?.id;

  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const { data: responses, isLoading: responsesLoading } = useQuery<FormResponse[]>({
    queryKey: ["/api/responses", productId],
    enabled: !!productId,
  });

  const isLoading = productLoading || responsesLoading;

  // Calculate category scores for chart
  const categoryScores = responses?.reduce((acc, response) => {
    const category = response.category || "General";
    if (!acc[category]) {
      acc[category] = { total: 0, count: 0 };
    }
    // Simple scoring: longer answers = better transparency
    const score = Math.min(100, (response.answer.length / 10) * 10);
    acc[category].total += score;
    acc[category].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>) || {};

  const chartData = Object.entries(categoryScores).map(([category, data]) => ({
    category,
    score: Math.round(data.total / data.count),
  }));

  const handleDownloadPDF = async () => {
    if (!productId) return;
    
    try {
      const response = await fetch(`/api/reports/${productId}/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${product?.name || "product"}-transparency-report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6" data-testid="button-back-to-dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : product && responses ? (
          <div className="space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl md:text-4xl font-heading font-semibold text-foreground" data-testid="text-report-title">
                        {product.name}
                      </h1>
                      <Badge variant="secondary" data-testid="badge-report-category">
                        {product.category}
                      </Badge>
                    </div>
                    {product.brand && (
                      <p className="text-lg text-muted-foreground">{product.brand}</p>
                    )}
                    {product.description && (
                      <p className="text-muted-foreground mt-2">{product.description}</p>
                    )}
                  </div>
                  <Button onClick={handleDownloadPDF} size="lg" data-testid="button-download-pdf">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              {product.transparencyScore !== null && (
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Overall Transparency Score</p>
                      <p className="text-3xl font-bold text-foreground" data-testid="text-overall-score">
                        {product.transparencyScore}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Chart */}
            {chartData.length > 0 && <TransparencyChart data={chartData} />}

            {/* Detailed Responses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-heading font-semibold">
                  Detailed Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {responses.map((response) => (
                  <div key={response.id} className="pb-6 border-b last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-foreground flex-1">
                        {response.question}
                      </h3>
                      {response.category && (
                        <Badge variant="outline" className="shrink-0">
                          {response.category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {response.answer}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Report Footer */}
            <Card className="bg-muted/50">
              <CardContent className="py-4">
                <p className="text-sm text-muted-foreground text-center">
                  Report generated on {new Date(product.createdAt).toLocaleDateString()} • 
                  Report ID: {product.id}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
                Report Not Found
              </h2>
              <p className="text-muted-foreground mb-6">
                The report you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/dashboard">
                <Button data-testid="button-not-found-dashboard">
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
