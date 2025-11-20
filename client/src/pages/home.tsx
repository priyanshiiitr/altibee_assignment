import { Navbar } from "@/components/navbar";
import { LandingHero } from "@/components/landing-hero";
import { HowItWorks } from "@/components/how-it-works";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <LandingHero />
      <HowItWorks />
      
      {/* CTA Section */}
      <section className="py-16 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground mb-4">
            Ready to Make Informed Choices?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start creating your first product transparency report today
          </p>
          <Link href="/form">
            <Button size="lg" className="px-8 py-6 text-lg" data-testid="button-cta-start">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 TransparencyHub. Empowering conscious consumers with AI-driven insights.</p>
          <p className="mt-2 text-xs">Your data is private and secure. We never share your information.</p>
        </div>
      </footer>
    </div>
  );
}
