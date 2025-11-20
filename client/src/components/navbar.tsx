import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { FileBarChart, Plus } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 hover-elevate px-3 py-2 rounded-md" data-testid="link-home">
              <FileBarChart className="h-6 w-6 text-primary" />
              <span className="font-heading font-bold text-xl text-foreground">
                TransparencyHub
              </span>
            </button>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button 
                variant={location === "/dashboard" ? "default" : "ghost"}
                data-testid="button-nav-dashboard"
              >
                Reports
              </Button>
            </Link>
            <Link href="/form">
              <Button data-testid="button-nav-create">
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
