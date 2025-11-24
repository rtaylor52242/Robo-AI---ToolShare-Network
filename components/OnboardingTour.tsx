import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import Button from './Button';

interface TourStep {
  targetId?: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const steps: TourStep[] = [
  {
    title: "Welcome to ToolShare",
    description: "Your community-powered platform for renting and lending tools. Let's take a quick tour!",
    position: 'center'
  },
  {
    targetId: 'search-container',
    title: "Find Any Tool",
    description: "Start here! Type what you need, or describe your project to find the perfect equipment nearby.",
    position: 'bottom'
  },
  {
    targetId: 'category-section',
    title: "Browse Categories",
    description: "Not sure what you need? Explore our catalog by category to discover tools for any job.",
    position: 'top'
  },
  {
    targetId: 'ai-chatbot-toggle',
    title: "AI Assistant",
    description: "Need expert advice? Chat with Robo AI to get personalized tool recommendations based on your project.",
    position: 'left' // Usually bottom right, so tooltip goes left
  },
  {
    targetId: 'list-tool-btn',
    title: "Earn Money",
    description: "Have idle tools? List them securely and start earning extra cash from your local community.",
    position: 'bottom'
  }
];

const OnboardingTour: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    // Check if user has seen tour
    const hasSeenTour = localStorage.getItem('hasSeenToolShareTour');
    if (hasSeenTour) {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const step = steps[currentStep];
    
    if (step.targetId) {
      const element = document.getElementById(step.targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Small delay to allow scroll to finish or element to render
        setTimeout(() => {
          setTargetRect(element.getBoundingClientRect());
        }, 100);
      } else {
        // If element not found (e.g., mobile view hiding navbar items), skip or center
        setTargetRect(null); 
      }
    } else {
      setTargetRect(null);
    }

    // Resize listener to update rect
    const handleResize = () => {
      if (step.targetId) {
        const el = document.getElementById(step.targetId);
        if (el) setTargetRect(el.getBoundingClientRect());
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentStep, isVisible]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenToolShareTour', 'true');
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const isTargeted = targetRect !== null;

  // Calculate tooltip position
  let tooltipStyle: React.CSSProperties = {};
  if (isTargeted && targetRect) {
    const spacing = 16;
    switch (step.position) {
      case 'bottom':
        tooltipStyle = { top: targetRect.bottom + spacing, left: targetRect.left + targetRect.width / 2, transform: 'translateX(-50%)' };
        break;
      case 'top':
        tooltipStyle = { top: targetRect.top - spacing, left: targetRect.left + targetRect.width / 2, transform: 'translate(-50%, -100%)' };
        break;
      case 'left':
        tooltipStyle = { top: targetRect.top + targetRect.height / 2, right: window.innerWidth - targetRect.left + spacing, transform: 'translateY(-50%)' };
        break;
      case 'right':
        tooltipStyle = { top: targetRect.top + targetRect.height / 2, left: targetRect.right + spacing, transform: 'translateY(-50%)' };
        break;
      default:
        tooltipStyle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  } else {
    tooltipStyle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'fixed' };
  }

  // Ensure tooltip stays on screen roughly
  // (In a real production app, use floating-ui or similar lib)

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {/* Dark Overlay with cutout */}
      <div className="absolute inset-0 bg-black/70 transition-colors duration-500 pointer-events-auto">
        {/* If targeted, we might want to "cut out" the hole. 
            For simplicity in this CSS-in-JS solution without external libs, 
            we will just rely on the spotlight visual or a high z-index highlight 
         */}
      </div>

      {/* Spotlight highlight on target */}
      {isTargeted && targetRect && (
        <div 
          className="absolute border-2 border-robo-500 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] pointer-events-none transition-all duration-300 ease-in-out box-content"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
        />
      )}

      {/* Tooltip Card */}
      <div 
        className="absolute w-[90vw] max-w-sm bg-gray-900 border border-robo-500/50 rounded-xl shadow-2xl p-6 pointer-events-auto transition-all duration-300"
        style={tooltipStyle}
      >
        <button 
          onClick={handleComplete}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={16} />
        </button>

        <div className="mb-4">
           <span className="text-robo-500 text-xs font-bold uppercase tracking-wider">Step {currentStep + 1} of {steps.length}</span>
           <h3 className="text-xl font-bold text-white mt-1 mb-2 font-display">{step.title}</h3>
           <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
        </div>

        <div className="flex justify-between items-center mt-6">
           <button 
             onClick={handleBack}
             disabled={currentStep === 0}
             className={`text-sm font-medium flex items-center gap-1 ${currentStep === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'}`}
           >
             <ChevronLeft size={16} /> Back
           </button>
           
           <div className="flex gap-2">
             <div className="flex gap-1 items-center mr-2">
                {steps.map((_, idx) => (
                  <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === currentStep ? 'bg-robo-500' : 'bg-gray-700'}`} />
                ))}
             </div>
             <Button size="sm" onClick={handleNext}>
               {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
             </Button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;