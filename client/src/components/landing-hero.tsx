import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export function LandingHero() {
  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 z-10" />
      
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80')",
        }}
      />

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
          Make Informed, Ethical Product Choices
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Our AI-powered platform collects comprehensive product information through intelligent questions, 
          generating detailed transparency reports for conscious consumers.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Link href="/form">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg font-semibold bg-primary/90 backdrop-blur-md hover-elevate active-elevate-2 border border-primary-border"
              data-testid="button-create-report"
            >
              Create Transparency Report
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-6 text-lg font-semibold bg-white/10 backdrop-blur-md text-white border-white/30 hover-elevate active-elevate-2"
              data-testid="button-view-reports"
            >
              View Reports
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap gap-6 justify-center text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span>AI-Powered Questions</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span>Data Privacy Protected</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span>Free PDF Reports</span>
          </div>
        </div>
      </div>
    </div>
  );
}
