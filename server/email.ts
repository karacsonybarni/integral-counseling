// Email service using SendGrid integration
import { MailService } from "@sendgrid/mail";
import type { Appointment, ContactInquiry } from "@shared/schema";

const mailService = new MailService();

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  // Check if SendGrid API key is available
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY environment variable not set');
    return false;
  }

  try {
    mailService.setApiKey(process.env.SENDGRID_API_KEY);
    
    const emailData: any = {
      to: params.to,
      from: {
        email: params.from,
        name: 'Barna Karácsony — Integrál tanácsadó jelölt'
      },
      subject: params.subject,
    };
    
    if (params.text) emailData.text = params.text;
    if (params.html) emailData.html = params.html;
    
    console.log('Attempting to send email with data:', {
      to: emailData.to,
      from: emailData.from,
      subject: emailData.subject
    });
    
    await mailService.send(emailData);
    
    console.log('Email sent successfully to:', params.to);
    return true;
  } catch (error: any) {
    console.error('SendGrid email error:', error);
    if (error?.response?.body?.errors) {
      console.error('SendGrid error details:', JSON.stringify(error.response.body.errors, null, 2));
    }
    return false;
  }
}

// Helper function to create contact inquiry email
export function createContactEmail(inquiry: ContactInquiry): EmailParams {
  const subject = `New Contact Inquiry from ${formatSubjectName(inquiry.name)}`;
  const submittedAt = formatSubmittedAt(inquiry.createdAt);
  
  const text = `
New Contact Inquiry Received:

Name: ${inquiry.name}
Email: ${inquiry.email}
Phone: ${inquiry.phone || 'Not provided'}
Preferred Contact: ${inquiry.preferredContact || 'Not specified'}

Message:
${inquiry.message}

---
Submitted on: ${submittedAt}
Inquiry ID: ${inquiry.id}
  `;

  const html = `
    <h2>New Contact Inquiry Received</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(inquiry.name)}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${escapeHtml(inquiry.email)}">${escapeHtml(inquiry.email)}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(inquiry.phone || 'Not provided')}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Preferred Contact:</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(inquiry.preferredContact || 'Not specified')}</td>
      </tr>
    </table>
    
    <h3>Message:</h3>
    <div style="padding: 12px; border: 1px solid #ddd; background-color: #f9f9f9; white-space: pre-wrap;">${escapeHtml(inquiry.message)}</div>
    
    <hr style="margin: 20px 0;">
    <p style="color: #666; font-size: 12px;">
      Submitted on: ${escapeHtml(submittedAt)}<br>
      Inquiry ID: ${escapeHtml(inquiry.id)}
    </p>
  `;

  return {
    to: 'karacsony.barni@gmail.com',
    from: 'karacsony.barni@gmail.com', // Using your verified Gmail address
    subject,
    text,
    html
  };
}

// Helper function to create appointment booking email
export function createAppointmentEmail(appointment: Appointment): EmailParams {
  const subject = `New Appointment Request from ${formatSubjectName(appointment.name)}`;
  const submittedAt = formatSubmittedAt(appointment.createdAt);
  
  const text = `
New Appointment Request Received:

Name: ${appointment.name}
Email: ${appointment.email}
Phone: ${appointment.phone || 'Not provided'}
Preferred Date: ${appointment.preferredDate}
Preferred Time: ${appointment.preferredTime}

Notes:
${appointment.message || 'No notes provided'}

---
Submitted on: ${submittedAt}
Appointment ID: ${appointment.id}
  `;

  const html = `
    <h2>New Appointment Request Received</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(appointment.name)}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${escapeHtml(appointment.email)}">${escapeHtml(appointment.email)}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(appointment.phone || 'Not provided')}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Preferred Date:</td>
        <td style="padding: 8px; border: 1px solid #ddd; color: #d97706; font-weight: bold;">${escapeHtml(appointment.preferredDate)}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Preferred Time:</td>
        <td style="padding: 8px; border: 1px solid #ddd; color: #d97706; font-weight: bold;">${escapeHtml(appointment.preferredTime)}</td>
      </tr>
    </table>
    
    <h3>Notes:</h3>
    <div style="padding: 12px; border: 1px solid #ddd; background-color: #f9f9f9; white-space: pre-wrap;">${escapeHtml(appointment.message || 'No notes provided')}</div>
    
    <hr style="margin: 20px 0;">
    <p style="color: #666; font-size: 12px;">
      Submitted on: ${escapeHtml(submittedAt)}<br>
      Appointment ID: ${escapeHtml(appointment.id)}
    </p>
  `;

  return {
    to: 'karacsony.barni@gmail.com',
    from: 'karacsony.barni@gmail.com', // Using your verified Gmail address
    subject,
    text,
    html
  };
}

function formatSubmittedAt(date: Date) {
  return date.toLocaleString("hu-HU", { timeZone: "Europe/Budapest" });
}

function formatSubjectName(name: string) {
  return name.replace(/[\r\n]+/g, " ");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
