import express, { Request, Response } from 'express';
import cors from 'cors';
import { MethodCalculator } from './domain/methodCalculator';


console.log('👀 Стартуємо index.ts...');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('✅ Сервер працює!');
});

app.post('/api/methods', (req: Request, res: Response) => {
    const { rawText } = req.body;
  
    if (!rawText) {
      return res.status(400).json({ error: 'Поле rawText є обовʼязковим!' });
    }
  
    // 1. Створюємо калькулятор
    const calc = new MethodCalculator();
  
    // 2. Парсимо текст
    const methodData = calc.parseMethod(rawText);
  
    // 3. Тимчасово задаємо кількість ін’єкцій вручну (або потім зробимо парсинг)
    methodData.totalInjections = 3;
  
    // 4. Рахуємо обсяги тощо
    calc.coreCalculations(methodData);
  
    // 5. Генеруємо текстовий звіт
    const report = calc.generateFinalReport(methodData);
  
    // 6. Відправляємо відповідь
    res.json({
        message: '✅ Методика оброблена',
        report: report,
        parsedData: methodData
      });
  });
  
app.listen(3000, () => {
  console.log('🚀 Сервер запущено на http://localhost:3000');
});
 
