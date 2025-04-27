/* index.ts (запускається як бекенд) */

import express, { Request, Response } from 'express';
import cors from 'cors';
import { MethodCalculator } from './domain/methodCalculator';
import { MethodData } from './domain/types';

console.log('👀 Стартуємо index.ts…');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.send('✅ Сервер працює!'));

/* ───────────────  POST /api/methods  ─────────────── */
app.post('/api/methods', (req: Request, res: Response) => {
  const { methodData } = req.body;

  /* 0. Перевіряємо наявність */
  if (!methodData) {
    return res.status(400).json({ error: 'Необхідно передати methodData!' });
  }

  /* 1. Перевірка core‑полів */
  const required = [
    'methodDurationMin',
    'flowRateMlMin',
    'sparePercent',
    'totalInjections',
    'solutions',
  ];
  for (const f of required) {
    if (methodData[f] === undefined) {
      return res.status(400).json({ error: `Відсутнє поле «${f}»` });
    }
  }

  /* 1‑bis. solutions має бути непорожнім масивом */
  if (!Array.isArray(methodData.solutions) || methodData.solutions.length === 0) {
    return res.status(400).json({ error: 'solutions має бути непорожнім масивом' });
  }

  /* 2. Формуємо об’єкт MethodData */
  const data: MethodData = {
    ...methodData,
    solventsTotals: methodData.solventsTotals || {},
    logMessages: methodData.logMessages || [],
    auditTrail: methodData.auditTrail || [],
  };

  /* DEBUG: що саме отримали */
  console.log('▶️  Отримано methodData\n', JSON.stringify(data, null, 2));

  /* 3. Розрахунок + обробка помилок калькулятора */
  try {
    const calc = new MethodCalculator();
    calc.coreCalculations(data);

    /* 4. Звіт */
    const report = calc.generateFinalReport(data);

    /* 5. Відповідь */
    return res.json({
      message: '✅ Метод оброблено успішно',
      report,
      processedData: data,
    });
  } catch (err: any) {
    console.error('💥 Помилка у coreCalculations:', err);
    return res.status(500).json({ error: 'Помилка обчислень', details: err?.message });
  }
});
/* ──────────────────────────────────────────────── */

app.listen(3000, () => {
  console.log('🚀 Сервер запущено на http://localhost:3000');
});
