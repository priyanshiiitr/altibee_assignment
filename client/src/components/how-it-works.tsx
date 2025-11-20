import { Card, CardContent } from "@/components/ui/card";
import { FileText, Sparkles, Download } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: "Enter Product Details",
      description: "Start by providing basic information about the product you want to analyze.",
    },
    {
      icon: Sparkles,
      title: "Answer AI Questions",
      description: "Our intelligent system asks relevant follow-up questions tailored to your product category.",
    },
    {
      icon: Download,
      title: "Get Your Report",
      description: "Receive a comprehensive transparency report with insights, metrics, and downloadable PDF.",
    },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to comprehensive product transparency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="hover-elevate transition-all duration-300" data-testid={`card-step-${index + 1}`}>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-sm font-semibold text-primary mb-2">Step {index + 1}</div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
