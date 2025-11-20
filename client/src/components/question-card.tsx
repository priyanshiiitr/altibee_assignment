import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuestionCardProps {
  question: string;
  questionId: string;
  value: string;
  onChange: (value: string) => void;
  tooltip?: string;
  type?: "text" | "textarea";
  placeholder?: string;
}

export function QuestionCard({
  question,
  questionId,
  value,
  onChange,
  tooltip,
  type = "textarea",
  placeholder = "Enter your answer...",
}: QuestionCardProps) {
  return (
    <Card className="hover-elevate transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-start gap-2">
          <span className="flex-1">{question}</span>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover-elevate rounded-full p-1" data-testid={`tooltip-${questionId}`}>
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {type === "textarea" ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[100px] resize-none"
            data-testid={`input-${questionId}`}
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            data-testid={`input-${questionId}`}
          />
        )}
      </CardContent>
    </Card>
  );
}
