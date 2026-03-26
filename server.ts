import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import dotenv from "dotenv";
import NordigenClient from "nordigen-node";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const nordigenClient = new NordigenClient({
  secretId: process.env.GOCARDLESS_SECRET_ID || "",
  secretKey: process.env.GOCARDLESS_SECRET_KEY || "",
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OPENAI_API_KEY no configurada" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Eres AutonomIA, un asistente virtual fiscal experto para autónomos en España en el año 2026. 
            Tu tono es profesional, cercano y proactivo. 
            Ayudas con IVA, IRPF, facturación electrónica (Ley Crea y Crece), Veri*factu y conciliación bancaria.
            Si el usuario pide algo relacionado con facturas, bancos o impuestos, ofrece acciones concretas.
            Responde siempre en español.`
          },
          ...messages
        ],
      });

      res.json({ text: response.choices[0].message.content });
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      res.status(500).json({ error: "Error al procesar la solicitud con ChatGPT" });
    }
  });

  // Open Banking Routes
  app.get("/api/banks/institutions", async (req, res) => {
    try {
      const country = (req.query.country as string) || "ES";
      await nordigenClient.generateToken();
      const institutions = await nordigenClient.institution.getInstitutions({ country });
      res.json(institutions);
    } catch (error) {
      console.error("Error fetching institutions:", error);
      res.status(500).json({ error: "Error al obtener la lista de bancos" });
    }
  });

  app.post("/api/banks/connect", async (req, res) => {
    try {
      const { institutionId, redirectUrl } = req.body;
      await nordigenClient.generateToken();
      
      const reference = uuidv4();
      const session = await nordigenClient.initSession({
        redirectUrl,
        institutionId,
        reference,
        userLanguage: "ES",
      });

      res.json(session);
    } catch (error) {
      console.error("Error initiating bank connection:", error);
      res.status(500).json({ error: "Error al iniciar la conexión bancaria" });
    }
  });

  app.get("/api/banks/requisition/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await nordigenClient.generateToken();
      const requisition = await nordigenClient.requisition.getRequisitionById(id);
      res.json(requisition);
    } catch (error) {
      console.error("Error fetching requisition:", error);
      res.status(500).json({ error: "Error al obtener el estado de la conexión" });
    }
  });

  app.get("/api/banks/accounts/:requisitionId", async (req, res) => {
    try {
      const { requisitionId } = req.params;
      await nordigenClient.generateToken();
      const requisition = await nordigenClient.requisition.getRequisitionById(requisitionId);
      
      const accounts = await Promise.all(
        requisition.accounts.map(async (accountId: string) => {
          const account = nordigenClient.account(accountId);
          const metadata = await account.getMetadata();
          const details = await account.getDetails();
          const balances = await account.getBalances();
          return { id: accountId, metadata, details, balances };
        })
      );

      res.json(accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      res.status(500).json({ error: "Error al obtener las cuentas bancarias" });
    }
  });

  app.get("/api/banks/transactions/:accountId", async (req, res) => {
    try {
      const { accountId } = req.params;
      await nordigenClient.generateToken();
      const account = nordigenClient.account(accountId);
      const transactions = await account.getTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Error al obtener los movimientos bancarios" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
  });
}

startServer();
