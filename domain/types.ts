export interface Solution {
    name: string;
    isInjected: boolean;
  }
  
  export interface OptionalSolution {
    name: string;
    maxVolumeMl: number;
    usedVolumeMl?: number;
  }
  
  export interface Injection {
    solutionName: string;
    injectionCount: number;
  }
  
  export interface GradientStep {
    timeMin: number;
    percentA: number;
    percentB: number;
  }
  
  export interface GradientData {
    gradientSteps: GradientStep[];
  }
  
  export interface MethodData {
    flowRateMlMin?: number;
    methodDurationMin?: number;
    sparePercent?: number;
    totalInjections?: number;
    gradientData?: GradientData;
    solutionsList: Solution[];
    injectionsList: Injection[];
    optionalSolutionsList: OptionalSolution[];
    mobilePhaseVolumeMl?: number;
    mobilePhaseComposition?: Record<string, number>;
    solventsTotals?: Record<string, number>;
    reagentsTotals?: Record<string, number>;
    logMessages: string[];
    auditTrail: string[];
  }
  