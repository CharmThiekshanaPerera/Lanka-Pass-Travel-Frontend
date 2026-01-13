import { Check, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  title: string;
  shortTitle: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps: number[];
}

const StepIndicator = ({ steps, currentStep, onStepClick, completedSteps }: StepIndicatorProps) => {
  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden lg:flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border z-0">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = currentStep === step.number;
          const isPast = step.number < currentStep;

          return (
            <button
              key={step.number}
              onClick={() => onStepClick(step.number)}
              className="flex flex-col items-center relative z-10 group"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 cursor-pointer",
                  isCurrent && "step-indicator-active",
                  isCompleted || isPast ? "step-indicator-completed" : "",
                  !isCurrent && !isCompleted && !isPast && "step-indicator-pending",
                  "hover:scale-110"
                )}
              >
                {isCompleted || isPast ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center max-w-[80px] transition-colors",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.shortTitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full step-indicator-active flex items-center justify-center font-semibold">
              {currentStep}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Step {currentStep} of {steps.length}</p>
              <p className="font-semibold text-foreground">{steps[currentStep - 1]?.title}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Dots */}
        <div className="flex justify-between mt-3">
          {steps.map((step) => (
            <button
              key={step.number}
              onClick={() => onStepClick(step.number)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                step.number === currentStep
                  ? "bg-primary"
                  : step.number < currentStep
                  ? "bg-accent"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Encouragement Message */}
      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
          <HelpCircle className="w-4 h-4" />
          {currentStep === steps.length
            ? "Almost there! Just confirm your details."
            : `You're doing great — just ${steps.length - currentStep} more step${steps.length - currentStep > 1 ? 's' : ''} to go.`}
        </p>
      </div>
    </div>
  );
};

export default StepIndicator;
