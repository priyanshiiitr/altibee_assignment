import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const getScoreColor = (score: number | null) => {
    if (!score) return "bg-muted text-muted-foreground";
    if (score >= 80) return "bg-green-500/10 text-green-700 dark:text-green-400";
    if (score >= 60) return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    return "bg-red-500/10 text-red-700 dark:text-red-400";
  };

  return (
    <Card className="hover-elevate transition-all duration-300 overflow-hidden" data-testid={`card-product-${product.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-lg text-foreground truncate" data-testid={`text-product-name-${product.id}`}>
              {product.name}
            </h3>
            {product.brand && (
              <p className="text-sm text-muted-foreground truncate">{product.brand}</p>
            )}
          </div>
          <Badge variant="secondary" className="shrink-0" data-testid={`badge-category-${product.id}`}>
            {product.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {product.description}
          </p>
        )}
        
        {product.transparencyScore !== null && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Transparency Score</span>
            </div>
            <Badge className={getScoreColor(product.transparencyScore)} data-testid={`score-${product.id}`}>
              {product.transparencyScore}%
            </Badge>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-3 border-t">
        <Link href={`/report/${product.id}`} className="w-full">
          <Button variant="outline" className="w-full" data-testid={`button-view-report-${product.id}`}>
            <FileText className="h-4 w-4 mr-2" />
            View Report
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
