import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const apiKey = req.body?.apiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({ error: 'NO_KEY' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      // Thinking level helper according to @google/genai guidelines:
      // - gemini-3.8-flash supports 'LOW' and 'HIGH', but NOT 'MINIMAL'
      // - gemini-3.1-flash-lite supports 'MINIMAL'
      // - Older models do not support thinkingConfig
      const getThinkingConfig = (modelName: string) => {
        if (modelName === 'gemini-3.1-flash-lite') {
          return { thinkingLevel: 'MINIMAL' as any };
        }
        if (modelName.startsWith('gemini-3')) {
          return { thinkingLevel: 'LOW' as any };
        }
        return undefined;
      };

      // Prioritize active high-speed models with fast latency:
      const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
      let replyText = '';
      let lastError: any = null;

      for (const model of candidateModels) {
        try {
          const config: any = {
            systemInstruction: req.body?.systemInstruction || undefined,
            maxOutputTokens: 600,
            temperature: 0.7,
          };
          const thinking = getThinkingConfig(model);
          if (thinking) {
            config.thinkingConfig = thinking;
          }

          const generatePromise = ai.models.generateContent({
            model: model,
            contents: req.body?.message || 'Xin chào',
            config,
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('TIMEOUT')), 5000)
          );

          const response = await Promise.race([generatePromise, timeoutPromise]);
          if (response?.text) {
            replyText = response.text;
            break;
          }
        } catch (err: any) {
          lastError = err;
          // Fallback attempt: if any error happened (e.g. thinking parameter conflict), retry without thinkingConfig
          try {
            const fallbackResponse = await ai.models.generateContent({
              model: model,
              contents: req.body?.message || 'Xin chào',
              config: {
                systemInstruction: req.body?.systemInstruction || undefined,
                maxOutputTokens: 600,
                temperature: 0.7,
              },
            });
            if (fallbackResponse?.text) {
              replyText = fallbackResponse.text;
              break;
            }
          } catch (retryErr: any) {
            lastError = retryErr;
          }
        }
      }

      if (replyText) {
        return res.status(200).json({ reply: replyText });
      } else {
        return res.status(200).json({ error: lastError?.message || 'Lỗi kết nối Gemini' });
      }
    } catch (err: any) {
      console.warn('Gemini chat handled with fallback:', err?.message || err);
      return res.status(200).json({ error: err?.message || 'Lỗi kết nối Gemini' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VIETSHOP Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
