import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

interface EmailRequest {
  from_name: string;
  to_email: string;
  template_key?: string;
  [key: string]: any;
}

const TEMPLATES: Record<string, string> = {
  contact: process.env.EMAILJS_CONTACT_TEMPLATE_ID!,
  welcome_new_user: process.env.EMAILJS_CONTACT_TEMPLATE_ID_2!,
  sendNews: process.env.EMAILJS_CONTACT_TEMPLATE_ID_3!,
};

// Limites de envio em memória
const emailLimits = new Map<string, { 
  welcomeSent: boolean; 
  newsCount: number; 
  newsWindowStart?: number;
}>();

const RATE_LIMIT_CONFIG = {
  NEWS_LIMIT: 5,
  NEWS_INTERVAL_MS: 24 * 60 * 60 * 1000, // 24 horas
};

const sendEmail = async (templateId: string, params: Record<string, any>) => {
  return axios.post("https://api.emailjs.com/api/v1.0/email/send", {
    service_id: process.env.EMAILJS_SERVICE_ID!,
    template_id: templateId,
    user_id: process.env.EMAILJS_USER_ID!,
    template_params: params,
  });
};

const emailHandler = async (
  req: Request<{}, {}, EmailRequest>,
  res: Response,
  next: NextFunction
) => {
  const { template_key, to_email, ...template_params } = req.body;

  if (!template_key || !TEMPLATES[template_key]) {
    return res.status(400).json({ 
      message: "Template inválido ou não especificado",
      available_templates: Object.keys(TEMPLATES)
    });
  }

  const now = Date.now();
  const userData = emailLimits.get(to_email) || { welcomeSent: false, newsCount: 0 };

  // Limite de e-mail de boas-vindas: apenas 1 vez por e-mail
  if (template_key === "welcome_new_user") {
    if (userData.welcomeSent) {
      return res.status(429).json({ message: "O e-mail de boas-vindas já foi enviado para esse endereço." });
    }
    userData.welcomeSent = true;
  }

  // Limite de envio de notícias: 5 por intervalo de 24h
  if (template_key === "sendNews") {
    if (!userData.newsWindowStart || now - userData.newsWindowStart > RATE_LIMIT_CONFIG.NEWS_INTERVAL_MS) {
      userData.newsWindowStart = now;
      userData.newsCount = 0;
    }

    if (userData.newsCount >= RATE_LIMIT_CONFIG.NEWS_LIMIT) {
      return res.status(429).json({ message: "Limite de e-mails de notícias atingido. Tente novamente mais tarde." });
    }

    userData.newsCount += 1;
  }

  emailLimits.set(to_email, userData);

  try {
    const response = await sendEmail(TEMPLATES[template_key], { to_email, ...template_params });
    res.status(200).json({ 
      message: "E-mail enviado com sucesso!", 
      template_used: template_key,
      response: response.data 
    });
  } catch (error) {
    console.error(`Erro ao enviar e-mail (template: ${template_key}):`, error);
    res.status(500).json({ 
      message: "Erro ao enviar e-mail",
      template: template_key
    });
  }
};

router.post("/send-email", (req: Request<{}, {}, EmailRequest>, res: Response, next: NextFunction) => {
  emailHandler(req, res, next).catch(next);
});

export default router;
