// src/components/WasteProgress.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Truck, Factory, Leaf } from 'lucide-react';
import { WasteStatus } from '@/lib/types';

interface WasteProgressProps {
  status: WasteStatus;
  timeline: Array<{
    status: WasteStatus;
    timestamp: string;
    by: string;
  }>;
  onStepClick?: (status: WasteStatus) => void;
}

const progressSteps: { status: WasteStatus; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { status: 'submitted', label: 'Submitted', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { status: 'collected', label: 'Collected', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
  { status: 'in_transit', label: 'In Transit', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100' },
  { status: 'delivered', label: 'Delivered', icon: Factory, color: 'text-green-600', bg: 'bg-green-100' },
  { status: 'processed', label: 'Processed', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-100' },
];

export default function WasteProgress({ status, timeline, onStepClick }: WasteProgressProps) {
  const currentStepIndex = progressSteps.findIndex(step => step.status === status);
  
  const getStepStatus = (stepIndex: number): 'completed' | 'current' | 'pending' => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };
  
  const getTimelineForStep = (stepStatus: WasteStatus) => {
    return timeline.find(t => t.status === stepStatus);
  };
  
  return (
    <div className="w-full py-4">
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-500 via-blue-500 to-green-500"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStepIndex / (progressSteps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="relative flex justify-between">
          {progressSteps.map((step, index) => {
            const stepStatus = getStepStatus(index);
            const Icon = step.icon;
            const timelineEntry = getTimelineForStep(step.status);
            
            return (
              <div
                key={step.status}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => onStepClick?.(step.status)}
              >
                <motion.div
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    stepStatus === 'completed'
                      ? `${step.bg} ${step.color} ring-4 ring-offset-2 ring-${step.color.split('-')[1]}-200`
                      : stepStatus === 'current'
                      ? 'bg-white border-2 border-primary shadow-lg scale-110'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon className={`w-5 h-5 ${
                    stepStatus === 'completed' ? step.color : stepStatus === 'current' ? 'text-primary' : 'text-gray-400'
                  }`} />
                </motion.div>
                
                <div className="mt-2 text-center">
                  <p className={`text-xs font-medium ${
                    stepStatus === 'completed' ? step.color : stepStatus === 'current' ? 'text-primary' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                  {timelineEntry && (
                    <p className="text-[10px] text-muted-foreground mt-1 hidden md:block">
                      {new Date(timelineEntry.timestamp).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}