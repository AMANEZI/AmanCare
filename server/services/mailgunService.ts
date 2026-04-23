import FormData from "form-data";
import Mailgun from "mailgun.js";

const mailgunApiKey = process.env.MAILGUN_API_KEY;
const mailgunDomain = process.env.MAILGUN_DOMAIN;

if (!mailgunApiKey || !mailgunDomain) {
  console.warn(
    "Warning: Mailgun API key or domain not configured. Email sending will be simulated."
  );
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!mailgunApiKey || !mailgunDomain) {
      console.log("[SIMULATED EMAIL]");
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`${options.html}`);
      return true;
    }

    const mailgun = new Mailgun(FormData);
    const client = mailgun.client({ username: "api", key: mailgunApiKey });
    const messageData = {
      from: options.from || `noreply@${mailgunDomain}`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await client.messages.create(mailgunDomain, messageData);
    console.log(`✅ Email sent to ${options.to}`);
    return true;
  } catch (error: any) {
    if (error?.status === 403) {
      console.warn(
        `Mailgun Sandbox Limitation: Cannot send to ${options.to}. Add this email to authorized recipients in Mailgun dashboard.`
      );
      console.warn("Email would have been sent with:");
      console.warn(`   Subject: ${options.subject}`);
      console.warn(`   To: ${options.to}`);
      console.warn("Fix: Go to https://app.mailgun.com and add authorized recipient");
    } else {
      console.error("Error sending email:", error);
    }
    return false;
  }
}

export function generateAccountCreationEmail(
  fullName: string,
  email: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
        .feature-list { margin: 20px 0; }
        .feature-list li { margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to CarePoint!</h1>
          <p>Your healthcare companion</p>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>Your account has been successfully created! 🎉</p>
          <p>You can now access all the healthcare services in your area:</p>
          <ul class="feature-list">
            <li>✓ Find nearby hospitals with real-time bed availability</li>
            <li>✓ Book beds and schedule appointments instantly</li>
            <li>✓ Access emergency services 24/7</li>
            <li>✓ Consult with doctors and specialists</li>
            <li>✓ Get AI-powered health advice</li>
          </ul>
          <p>
            <a href="https://carepoint.app" class="button">Start Using CarePoint</a>
          </p>
          <p><strong>Your Account Details:</strong></p>
          <p>
            Email: <strong>${email}</strong><br>
            Status: <strong>Active</strong>
          </p>
          <p>If you have any questions or need support, feel free to contact us.</p>
          <p>Best regards,<br><strong>CarePoint Team</strong></p>
        </div>
        <div class="footer">
          <p>&copy; 2024 CarePoint. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateLoginVerificationEmail(
  email: string,
  verificationCode: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
        .code-box { background: white; border: 2px solid #667eea; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0; }
        .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 3px; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
        .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verification Code</h1>
          <p>CarePoint Login</p>
        </div>
        <div class="content">
          <h2>Hello,</h2>
          <p>You've requested to log in to your CarePoint account. Use the verification code below:</p>
          <div class="code-box">
            <div class="code">${verificationCode}</div>
          </div>
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong> If you didn't request this code, please contact our support team immediately. Someone may be trying to access your account.
          </div>
          <p>
            <strong>For Security:</strong>
          </p>
          <ul>
            <li>Never share your verification code with anyone</li>
            <li>CarePoint will never ask for your code via email or phone</li>
            <li>Always use official CarePoint apps and websites</li>
          </ul>
          <p>Best regards,<br><strong>CarePoint Security Team</strong></p>
        </div>
        <div class="footer">
          <p>&copy; 2024 CarePoint. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateBedBookingEmail(
  fullName: string,
  hospitalName: string,
  bedType: string,
  checkInDate: string,
  bookingId: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
        .details-box { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .label { font-weight: bold; color: #667eea; }
        .value { color: #333; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Bed Booking Confirmation</h1>
          <p>CarePoint Healthcare</p>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>Your bed booking request has been <strong>successfully confirmed!</strong> 🎉</p>
          <h3>Booking Details</h3>
          <div class="details-box">
            <div class="detail-row">
              <span class="label">Hospital:</span>
              <span class="value">${hospitalName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Bed Type:</span>
              <span class="value">${bedType}</span>
            </div>
            <div class="detail-row">
              <span class="label">Check-in Date:</span>
              <span class="value">${new Date(checkInDate).toLocaleDateString()}</span>
            </div>
            <div class="detail-row">
              <span class="label">Booking ID:</span>
              <span class="value">${bookingId}</span>
            </div>
          </div>
          <h3>What Happens Next?</h3>
          <ol>
            <li>The hospital will review your booking request</li>
            <li>You'll receive a confirmation via email or phone</li>
            <li>The hospital will contact you with final details</li>
          </ol>
          <p>
            <a href="https://carepoint.app/bookings" class="button">View Your Bookings</a>
          </p>
          <p>
            <strong>Need Help?</strong> If you have any questions about your booking, please contact us at support@carepoint.app
          </p>
          <p>Best regards,<br><strong>CarePoint Team</strong></p>
        </div>
        <div class="footer">
          <p>&copy; 2024 CarePoint. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateAppointmentEmail(
  fullName: string,
  hospitalName: string,
  doctorName: string,
  specialty: string,
  appointmentDate: string,
  appointmentTime: string,
  bookingId: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
        .details-box { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .label { font-weight: bold; color: #667eea; }
        .value { color: #333; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Appointment Confirmation</h1>
          <p>CarePoint Healthcare</p>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>Your appointment has been <strong>successfully scheduled!</strong> 🎉</p>
          <h3>Appointment Details</h3>
          <div class="details-box">
            <div class="detail-row">
              <span class="label">Hospital:</span>
              <span class="value">${hospitalName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Doctor:</span>
              <span class="value">Dr. ${doctorName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Specialty:</span>
              <span class="value">${specialty}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date:</span>
              <span class="value">${new Date(appointmentDate).toLocaleDateString()}</span>
            </div>
            <div class="detail-row">
              <span class="label">Time:</span>
              <span class="value">${appointmentTime}</span>
            </div>
            <div class="detail-row">
              <span class="label">Booking ID:</span>
              <span class="value">${bookingId}</span>
            </div>
          </div>
          <h3>Important Reminders</h3>
          <ul>
            <li>Please arrive 10-15 minutes early</li>
            <li>Bring a valid ID and any medical documents</li>
            <li>If you need to reschedule, contact the hospital immediately</li>
          </ul>
          <p>
            <a href="https://carepoint.app/bookings" class="button">View Your Appointments</a>
          </p>
          <p>
            <strong>Need Help?</strong> If you have any questions about your appointment, please contact us at support@carepoint.app
          </p>
          <p>Best regards,<br><strong>CarePoint Team</strong></p>
        </div>
        <div class="footer">
          <p>&copy; 2024 CarePoint. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
