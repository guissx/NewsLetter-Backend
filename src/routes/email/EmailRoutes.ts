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

const sendEmail = async (templateId: string, params: Record<string, any>) => {
  return axios.post("https://api.emailjs.com/api/v1.0/email/send", {
    service_id: process.env.EMAILJS_SERVICE_ID!,
    template_id: templateId,
    user_id: process.env.EMAILJS_USER_ID!,
    template_params: params,
  });
};

// Handler tipado explicitamente como RequestHandler
const emailHandler = async (
  req: Request<{}, {}, EmailRequest>,
  res: Response,
  next: NextFunction
) => {
  const { template_key, ...template_params } = req.body;

  if (!template_key || !TEMPLATES[template_key]) {
    return res.status(400).json({ 
      message: "Template inválido ou não especificado",
      available_templates: Object.keys(TEMPLATES)
    });
  }

  try {
    const response = await sendEmail(TEMPLATES[template_key], template_params);
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