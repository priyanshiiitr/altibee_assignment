import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function ProgressIndicator({ currentStep, totalSteps, steps }: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                    ${isCompleted ? "bg-primary border-primary text-primary-foreground" : ""}
                    ${isCurrent ? "bg-primary border-primary text-primary-foreground scale-110" : ""}
                    ${!isCompleted && !isCurrent ? "bg-background border-border text-muted-foreground" : ""}
                  `}
                  data-testid={`step-indicator-${stepNumber}`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="font-semibold">{stepNumber}</span>
                  )}
                </div>
                <div className="mt-2 text-xs font-medium text-center max-w-[100px] hidden sm:block">
                  {step}
                </div>
              </div>
              
              {index < totalSteps - 1 && (
                <div
                  className={`
                    h-0.5 flex-1 mx-2 transition-all duration-300
                    ${isCompleted ? "bg-primary" : "bg-border"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
