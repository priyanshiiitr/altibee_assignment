import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { ProgressIndicator } from "@/components/progress-indicator";
import { QuestionCard } from "@/components/question-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Loader2, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { createProductFormSchema } from "@shared/schema";
import { z } from "zod";

const PRODUCT_CATEGORIES = [
  "Food & Beverages",
  "Personal Care",
  "Cosmetics",
  "Supplements",
  "Household Products",
  "Clothing & Textiles",
  "Electronics",
  "Other",
];

const STEPS = ["Product Info", "AI Questions", "Review"];

interface AIQuestion {
  id: string;
  question: string;
  category: string;
  tooltip?: string;
}

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [productId, setProductId] = useState<string | null>(null);
  const [aiQuestions, setAiQuestions] = useState<AIQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createProductFormSchema>>({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      name: "",
      category: "",
      brand: "",
      description: "",
    },
  });

  // Step 1: Create product
  const createProductMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createProductFormSchema>) => {
      const res = await apiRequest("POST", "/api/products", data);
      return res.json();
    },
    onSuccess: (data) => {
      setProductId(data.productId);
      setCurrentStep(2);
      toast({
        title: "Product created",
        description: "Now let's gather more information",
      });
      generateQuestionsMutation.mutate(data.productId);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate AI questions
  const generateQuestionsMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await apiRequest("POST", "/api/questions/generate", { productId });
      return res.json();
    },
    onSuccess: (data) => {
      setAiQuestions(data.questions);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Submit answers
  const submitAnswersMutation = useMutation({
    mutationFn: async () => {
      if (!productId) throw new Error("No product ID");
      
      const responses = aiQuestions.map((q) => ({
        questionId: q.id,
        question: q.question,
        answer: answers[q.id] || "",
        category: q.category,
      }));

      const res = await apiRequest("POST", "/api/responses", {
        productId,
        responses,
      });
      return res.json();
    },
    onSuccess: () => {
      setCurrentStep(3);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit answers. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate report
  const generateReportMutation = useMutation({
    mutationFn: async () => {
      if (!productId) throw new Error("No product ID");
      const res = await apiRequest("POST", "/api/reports/generate", { productId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success!",
        description: "Your transparency report has been generated",
      });
      setLocation(`/report/${productId}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmitStep1 = (data: z.infer<typeof createProductFormSchema>) => {
    createProductMutation.mutate(data);
  };

  const handleNextStep2 = () => {
    const unanswered = aiQuestions.filter((q) => !answers[q.id]?.trim());
    if (unanswered.length > 0) {
      toast({
        title: "Please answer all questions",
        description: `${unanswered.length} question(s) remaining`,
        variant: "destructive",
      });
      return;
    }
    submitAnswersMutation.mutate();
  };

  const handleGenerateReport = () => {
    generateReportMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-semibold text-foreground mb-2">
            Create Transparency Report
          </h1>
          <p className="text-muted-foreground">
            Answer a few questions to generate a comprehensive product transparency report
          </p>
        </div>

        <ProgressIndicator 
          currentStep={currentStep} 
          totalSteps={STEPS.length}
          steps={STEPS}
        />

        {/* Step 1: Product Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-heading font-semibold">
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitStep1)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Organic Green Tea" {...field} data-testid="input-product-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-product-category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PRODUCT_CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Nature's Best" {...field} data-testid="input-brand" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of the product..."
                            className="min-h-[100px] resize-none"
                            {...field}
                            data-testid="input-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      size="lg"
                      disabled={createProductMutation.isPending}
                      data-testid="button-next-step1"
                    >
                      {createProductMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: AI Questions */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-4 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <p className="text-sm text-foreground">
                  {generateQuestionsMutation.isPending 
                    ? "Generating intelligent questions based on your product..." 
                    : `Answer ${aiQuestions.length} AI-generated questions to build your transparency report`}
                </p>
              </CardContent>
            </Card>

            {generateQuestionsMutation.isPending ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="py-8">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-20 bg-muted rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {aiQuestions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      questionId={question.id}
                      question={question.question}
                      value={answers[question.id] || ""}
                      onChange={(value) => setAnswers({ ...answers, [question.id]: value })}
                      tooltip={question.tooltip}
                    />
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    data-testid="button-back-step2"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNextStep2}
                    size="lg"
                    disabled={submitAnswersMutation.isPending}
                    data-testid="button-next-step2"
                  >
                    {submitAnswersMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Continue to Review
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 3: Review & Generate */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-heading font-semibold">
                Review & Generate Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-muted-foreground mb-4">
                  You've answered all questions! Click below to generate your comprehensive transparency report.
                </p>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">What's included:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Comprehensive product analysis</li>
                    <li>✓ Transparency score and metrics</li>
                    <li>✓ Category-specific insights</li>
                    <li>✓ Downloadable PDF report</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  data-testid="button-back-step3"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleGenerateReport}
                  size="lg"
                  disabled={generateReportMutation.isPending}
                  data-testid="button-generate-report"
                >
                  {generateReportMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
