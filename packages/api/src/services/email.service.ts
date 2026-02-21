import nodemailer from "nodemailer";
import { DEFAULTS } from "../constants";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || DEFAULTS.SMTP.HOST,
  port: parseInt(process.env.SMTP_PORT || String(DEFAULTS.SMTP.PORT), 10),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

const FROM_ADDRESS = process.env.SMTP_FROM || DEFAULTS.SMTP.FROM;

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

async function send(options: SendMailOptions) {
  if (!process.env.SMTP_HOST) {
    console.log(`[Email] (dev, no SMTP configured) To: ${options.to} | Subject: ${options.subject}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: FROM_ADDRESS,
      ...options,
    });
  } catch (error) {
    console.error("[Email] Error sending:", error);
  }
}

function baseTemplate(content: string, tenantName: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f4f5">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px">
    <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
      <div style="background:#1e293b;padding:24px 32px">
        <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600">${tenantName}</h1>
      </div>
      <div style="padding:32px">
        ${content}
      </div>
      <div style="border-top:1px solid #e5e7eb;padding:16px 32px;text-align:center">
        <p style="margin:0;color:#9ca3af;font-size:12px">
          Enviado por ${tenantName} · Plataforma Inmobiliaria
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export class EmailService {
  static async notifyNewLead(params: {
    agentEmail: string;
    agentName: string;
    tenantName: string;
    leadName: string;
    leadEmail: string;
    leadPhone?: string;
    leadMessage?: string;
    propertyTitle: string;
    propertyUrl?: string;
  }) {
    const content = `
      <h2 style="margin:0 0 16px;color:#1e293b;font-size:18px">Nuevo lead recibido</h2>
      <p style="color:#475569;line-height:1.6;margin:0 0 24px">
        <strong>${params.leadName}</strong> dejó una consulta sobre
        <strong>${params.propertyTitle}</strong>.
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <tr>
          <td style="padding:8px 0;color:#64748b;font-size:14px;width:100px">Nombre</td>
          <td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:500">${params.leadName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#64748b;font-size:14px">Email</td>
          <td style="padding:8px 0;color:#1e293b;font-size:14px">
            <a href="mailto:${params.leadEmail}" style="color:#3b82f6">${params.leadEmail}</a>
          </td>
        </tr>
        ${params.leadPhone ? `
        <tr>
          <td style="padding:8px 0;color:#64748b;font-size:14px">Teléfono</td>
          <td style="padding:8px 0;color:#1e293b;font-size:14px">${params.leadPhone}</td>
        </tr>` : ""}
        ${params.leadMessage ? `
        <tr>
          <td style="padding:8px 0;color:#64748b;font-size:14px;vertical-align:top">Mensaje</td>
          <td style="padding:8px 0;color:#1e293b;font-size:14px">${params.leadMessage}</td>
        </tr>` : ""}
      </table>
      ${params.propertyUrl ? `
      <a href="${params.propertyUrl}" style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500">
        Ver propiedad
      </a>` : ""}
    `;

    await send({
      to: params.agentEmail,
      subject: `Nuevo lead: ${params.leadName} - ${params.propertyTitle}`,
      html: baseTemplate(content, params.tenantName),
      replyTo: params.leadEmail,
    });
  }

  static async confirmLeadToVisitor(params: {
    visitorEmail: string;
    visitorName: string;
    tenantName: string;
    tenantPhone?: string;
    propertyTitle: string;
  }) {
    const content = `
      <h2 style="margin:0 0 16px;color:#1e293b;font-size:18px">¡Recibimos tu consulta!</h2>
      <p style="color:#475569;line-height:1.6;margin:0 0 16px">
        Hola <strong>${params.visitorName}</strong>, gracias por tu interés en
        <strong>${params.propertyTitle}</strong>.
      </p>
      <p style="color:#475569;line-height:1.6;margin:0 0 24px">
        Nuestro equipo se pondrá en contacto con vos a la brevedad.
        ${params.tenantPhone ? `También podés comunicarte al <strong>${params.tenantPhone}</strong>.` : ""}
      </p>
      <p style="color:#94a3b8;font-size:13px;margin:0">
        Si no realizaste esta consulta, podés ignorar este email.
      </p>
    `;

    await send({
      to: params.visitorEmail,
      subject: `Consulta recibida - ${params.propertyTitle}`,
      html: baseTemplate(content, params.tenantName),
    });
  }

  static async sendSearchAlert(params: {
    email: string;
    tenantName: string;
    propertyTitle: string;
    propertyUrl: string;
    unsubscribeUrl: string;
  }) {
    const content = `
      <h2 style="color:#1e293b;font-size:20px;margin:0 0 16px">
        ¡Nueva propiedad que coincide con tu búsqueda!
      </h2>
      <p style="color:#475569;line-height:1.6;margin:0 0 24px">
        Se publicó una nueva propiedad que puede interesarte:
        <strong>${params.propertyTitle}</strong>
      </p>
      <div style="text-align:center;margin:0 0 24px">
        <a href="${params.propertyUrl}"
           style="display:inline-block;background:#1e40af;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600">
          Ver propiedad
        </a>
      </div>
      <p style="color:#94a3b8;font-size:12px;margin:0">
        <a href="${params.unsubscribeUrl}" style="color:#94a3b8">Dejar de recibir alertas</a>
      </p>
    `;

    await send({
      to: params.email,
      subject: `Nueva propiedad: ${params.propertyTitle} - ${params.tenantName}`,
      html: baseTemplate(content, params.tenantName),
    });
  }
}
