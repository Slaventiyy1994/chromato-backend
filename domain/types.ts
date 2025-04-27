/**
 * Головні типи для вашої модельної логіки.
 */

export interface GradientStep {
  timeMin: number;
  percentA: number;
  percentB: number;
}

export interface GradientData {
  gradientSteps: GradientStep[];
}

export interface ReagentVolume {
  name: string;
  volumeMl: number;
}

export interface MethodSolution {
  name: string;
  type: 'liquid' | 'solid';
  isMobilePhase: boolean;
  isInjected: boolean;
  injectionCount: number;
  parallels: number;
  composition: Record<string, number>;
  targetVolume?: number;
}

export interface MethodData {
  methodDurationMin: number;
  flowRateMlMin: number;
  sparePercent: number;
  totalInjections?: number;
  gradientData?: GradientData;
  solutions: MethodSolution[];

  // результатні поля
  mobilePhaseVolumeMl?: number;
  solventsTotals: Record<string, number>;
  reagentsTotals?: Record<string, number>;

  // аудит
  logMessages: string[];
  auditTrail: string[];
}
