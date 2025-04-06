// domain/methodCalculator.ts

import {
  MethodData,
  Injection,
  Solution,
  OptionalSolution,
  GradientData
} from './types';
  
  export class MethodCalculator {
    /**
     * Створює порожній об’єкт методики
     */
    createEmptyMethod(): MethodData {
      return {
        flowRateMlMin: undefined,
        methodDurationMin: undefined,
        sparePercent: undefined,
        totalInjections: undefined,
        gradientData: undefined,
        solutionsList: [],
        injectionsList: [],
        optionalSolutionsList: [],
        mobilePhaseVolumeMl: undefined,
        mobilePhaseComposition: {},
        solventsTotals: {},
        reagentsTotals: {},
        logMessages: [],
        auditTrail: [],
      };
    }
  
    /**
     * Спрощений парсинг тексту методики
     */
    parseMethod(rawText: string): MethodData {
      const data = this.createEmptyMethod();
  
      data.flowRateMlMin = this.parseFlowRate(rawText);
      data.methodDurationMin = this.parseMethodDuration(rawText);
      data.sparePercent = this.parseSparePercent(rawText);
  
      data.solutionsList = this.parseSolutions(rawText);
      data.injectionsList = this.parseInjections(rawText);
      data.optionalSolutionsList = this.parseOptionalSolutions(rawText);
  
      data.logMessages.push('Парсинг завершено.');
      data.auditTrail.push('parseMethod викликано');
      return data;
    }
  
    private parseFlowRate(text: string): number | undefined {
      const match = text.match(/flow\s*rate\s*[:=]?\s*(\d+(\.\d+)?)\s*ml\/min/i);
      return match ? parseFloat(match[1]) : undefined;
    }
  
    private parseMethodDuration(text: string): number | undefined {
      const match = text.match(/(run\s*time|duration)\s*[:=]?\s*(\d+(\.\d+)?)\s*min/i);
      return match ? parseFloat(match[2]) : undefined;
    }
  
    private parseSparePercent(text: string): number | undefined {
      const match = text.match(/(extra|spare|reserve)\s*(\d+)%/i);
      return match ? parseFloat(match[2]) / 100 : undefined;
    }
  
    private parseSolutions(text: string): Solution[] {
      // Заглушка: повертаємо тестовий список
      return [
        { name: 'Solution A', isInjected: true },
        { name: 'Solution B', isInjected: false },
      ];
    }
  
    private parseInjections(text: string): Injection[] {
      return [
        { solutionName: 'Solution A', injectionCount: 2 },
      ];
    }
  
    private parseOptionalSolutions(text: string): OptionalSolution[] {
      return [
        { name: '0.1 M KOH', maxVolumeMl: 100, usedVolumeMl: 0 },
      ];
    }
  
    /**
     * Основні розрахунки: мобільна фаза, масштабування, ін’єкції
     */
    coreCalculations(data: MethodData): void {
      const totalInj = data.totalInjections ?? 1;
      const tMethod = data.methodDurationMin ?? 0;
      const flow = data.flowRateMlMin ?? 0;
      const spare = data.sparePercent ?? 0;
  
      const volumeNoSpare = flow * tMethod * totalInj;
      const volumeWithSpare = volumeNoSpare * (1 + spare);
  
      data.mobilePhaseVolumeMl = volumeWithSpare;
  
      // Спрощений розподіл — 50/50 вода/ацетонітрил
      data.mobilePhaseComposition = {
        Water: volumeWithSpare * 0.5,
        Acetonitrile: volumeWithSpare * 0.5,
      };
  
      data.logMessages.push(`Розраховано моб. фазу: ${volumeWithSpare.toFixed(1)} мл`);
      data.auditTrail.push('coreCalculations виконано');
    }
  
    /**
     * Формує звіт за розрахунками
     */
    generateFinalReport(data: MethodData): string {
      let report = '=== Хроматографічний звіт ===\n';
  
      report += `🔹 Швидкість потоку: ${data.flowRateMlMin} мл/хв\n`;
      report += `🔹 Тривалість методу: ${data.methodDurationMin} хв\n`;
      report += `🔹 Запас: ${(data.sparePercent ?? 0) * 100}%\n`;
      report += `🔹 Ін’єкцій: ${data.totalInjections}\n\n`;
  
      report += `🔹 Об’єм мобільної фази: ${data.mobilePhaseVolumeMl?.toFixed(2)} мл\n`;
      report += `🔹 Склад:\n`;
      for (const [key, val] of Object.entries(data.mobilePhaseComposition ?? {})) {
        report += `   - ${key}: ${val.toFixed(2)} мл\n`;
      }
  
      report += '\n🔹 Розчини:\n';
      data.solutionsList.forEach((s) => {
        report += `   - ${s.name}, вводиться: ${s.isInjected ? 'так' : 'ні'}\n`;
      });
  
      report += '\n🔹 Опційні розчини:\n';
      data.optionalSolutionsList.forEach((opt) => {
        report += `   - ${opt.name}: використано ${opt.usedVolumeMl ?? 0} мл\n`;
      });
  
      report += '\n=== Кінець звіту ===\n';
      return report;
    }
  }