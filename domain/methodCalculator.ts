/**
 * Проста реалізація «метод-калькулятора», як у прикладах.
 */
import { MethodData, ReagentVolume } from './types';

export class MethodCalculator {
  public coreCalculations(data: MethodData): void {
    data.auditTrail.push('coreCalculations: старт');

    let injections =
      data.totalInjections ??
      data.solutions[0]?.injectionCount ??
      1;

    if (!isFinite(injections) || injections <= 0) injections = 1;
    data.logMessages.push(`Ін’єкцій (крок 1): ${injections}`);

    // (2) Мобільна фаза
    const { flowRateMlMin: f, methodDurationMin: t, sparePercent: s } = data;
    const mobileVol   = f * t * injections;
    const mobileVolSp = mobileVol * (1 + s);
    data.mobilePhaseVolumeMl = mobileVolSp;
    data.logMessages.push(
      `Моб. фаза: ${f}×${t}×${injections} ×(1+${s}) = ${mobileVolSp.toFixed(2)} мл`
    );

    // (3) Колби / розчини
    data.solventsTotals = {};

    data.solutions.forEach((sol) => {
      const totalForSol = sol.targetVolume ?? 0;
      if (!sol.targetVolume) {
        data.logMessages.push(`⚠️ У розчині "${sol.name}" не задано targetVolume`);
      }

      if (sol.composition && totalForSol > 0) {
        // варіант: маємо пропорції (composition)
        Object.entries(sol.composition).forEach(([rName, frac]) => {
          const need = totalForSol * frac * sol.parallels;
          const k = rName.replace(/\s*\(.*?\)\s*$/, '').trim();
          data.solventsTotals[k] = (data.solventsTotals[k] || 0) + need;
        });
      }
      // Якщо інші варіанти (reagents), треба дописати за потреби…

      // Лишимо заглушку
    });

    // (4) Додаємо моб. фазу до solventsTotals
    const mobileKey =
      data.solutions.find((s) => s.isMobilePhase)?.name.trim() || 'Рухома фаза';
    data.solventsTotals[mobileKey] =
      (data.solventsTotals[mobileKey] || 0) + mobileVolSp;

    data.logMessages.push('Сумування реагентів завершено');
    data.auditTrail.push('coreCalculations: завершено');
  }

  public generateFinalReport(data: MethodData): string {
    let r = '=== Хроматографічний звіт ===\n';
    r += `Тривалість: ${data.methodDurationMin} хв\n`;
    r += `Потік:      ${data.flowRateMlMin} мл/хв\n`;
    r += `Запас:      ${(data.sparePercent * 100).toFixed(1)}%\n`;

    // локальний fallback
    const inj =
      data.totalInjections ??
      data.solutions[0]?.injectionCount ??
      1;
    r += `Ін’єкції:   ${inj}\n`;

    r += `\n--- Розчини (${data.solutions.length}) ---\n`;
    data.solutions.forEach((s, i) => {
      r += `${i + 1}. ${s.name}\n`;
      r += `   • mobilePhase: ${s.isMobilePhase}\n`;
      r += `   • parallels:   ${s.parallels}\n`;
      r += `   • targetVol:   ${s.targetVolume ?? 0} мл\n`;
    });

    r += `\nОбсяг мобільної фази (для хроматографа): ${data.mobilePhaseVolumeMl?.toFixed(
      2
    )} мл\n`;

    if (Object.keys(data.solventsTotals).length) {
      r += `\n--- Підсумок реагентів ---\n`;
      Object.entries(data.solventsTotals).forEach(([n, v]) =>
        (r += `   • ${n}: ${v.toFixed(2)} мл\n`)
      );
    }

    if (data.logMessages.length) {
      r += `\n--- Логи ---\n`;
      data.logMessages.forEach((m) => (r += `   * ${m}\n`));
    }

    r += '\n=== Кінець звіту ===\n';
    return r;
  }
}
