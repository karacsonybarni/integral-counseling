// Email service using SendGrid integration
import { MailService } from '@sendgrid/mail';

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
        name: 'Dr. Karácsony Barna - Website'
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
export function createContactEmail(inquiry: any): EmailParams {
  const subject = `New Contact Inquiry from ${inquiry.name}`;
  
  const text = `
New Contact Inquiry Received:

Name: ${inquiry.name}
Email: ${inquiry.email}
Phone: ${inquiry.phone || 'Not provided'}
Service Type: ${inquiry.serviceType || 'Not specified'}
Preferred Contact: ${inquiry.preferredContact || 'Not specified'}

Message:
${inquiry.message}

---
Submitted on: ${new Date().toLocaleString('hu-HU', { timeZone: 'Europe/Budapest' })}
Inquiry ID: ${inquiry.id}
  `;

  const html = `
    <h2>New Contact Inquiry Received</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${inquiry.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${inquiry.phone || 'Not provided'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Service Type:</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${inquiry.serviceType || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Preferred Contact:</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${inquiry.preferredContact || 'Not specified'}</td>
      </tr>
    </table>
    
    <h3>Message:</h3>
    <div style="padding: 12px; border: 1px solid #ddd; background-color: #f9f9f9; white-space: pre-wrap;">${inquiry.message}</div>
    
    <hr style="margin: 20px 0;">
    <p style="color: #666; font-size: 12px;">
      Submitted on: ${new Date().toLocaleString('hu-HU', { timeZone: 'Europe/Budapest' })}<br>
      Inquiry ID: ${inquiry.id}
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
export function createAppointmentEmail(appointment: any): EmailParams {
  const subject = `New Appointment Request from ${appointment.name}`;
  
  const text = `
New Appointment Request Received:

Name: ${appointment.name}
Email: ${appointment.email}
Phone: ${appointment.phone || 'Not provided'}
Service Type: ${appointment.serviceType}
Preferred Date: ${appointment.preferredDate}
Preferred Time: ${appointment.preferredTime}
Preferred Contact: ${appointment.preferredContact || 'Not specified'}

Notes:
${appointment.notes || 'No notes provided'}

---
Submitted on: ${new Date().toLocaleString('hu-HU', { timeZone: 'Europe/Budapest' })}
Appointment ID: ${appointment.id}
  `;

  const html = `
    <h2>New Appointment Request Received</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${appointment.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${appointment.email}">${appointment.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${appointment.phone || 'Not provided'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Service Type:</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${appointment.serviceType}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Preferred Date:</td>
        <td style="padding: 8px; border: 1px solid #ddd; color: #d97706; font-weight: bold;">${appointment.preferredDate}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Preferred Time:</td>
        <td style="padding: 8px; border: 1px solid #ddd; color: #d97706; font-weight: bold;">${appointment.preferredTime}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Preferred Contact:</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${appointment.preferredContact || 'Not specified'}</td>
      </tr>
    </table>
    
    <h3>Notes:</h3>
    <div style="padding: 12px; border: 1px solid #ddd; background-color: #f9f9f9; white-space: pre-wrap;">${appointment.notes || 'No notes provided'}</div>
    
    <hr style="margin: 20px 0;">
    <p style="color: #666; font-size: 12px;">
      Submitted on: ${new Date().toLocaleString('hu-HU', { timeZone: 'Europe/Budapest' })}<br>
      Appointment ID: ${appointment.id}
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