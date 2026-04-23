import {
  sendEmail,
  generateAccountCreationEmail,
  generateLoginVerificationEmail,
  generateBedBookingEmail,
  generateAppointmentEmail,
} from "./gmailService";

export interface NotificationResult {
  success: boolean;
  method: "email" | "sms" | "both";
  emailSent?: boolean;
  smsSent?: boolean;
  message: string;
  confirmationId?: string;
}

export interface StoredConfirmation {
  id: string;
  timestamp: string;
  type: "bed_booking" | "account_creation" | "login_verification";
  email?: string;
  phoneNumber?: string;
  subject: string;
  body: string;
  userDetails?: {
    fullName: string;
  };
}

interface SendConfirmationPayload {
  email?: string;
  phoneNumber?: string;
  type: "bed_booking" | "account_creation" | "login_verification";
  bookingDetails?: {
    hospitalName: string;
    bedType: string;
    checkInDate: string;
  };
  userDetails?: {
    fullName: string;
  };
}

export async function sendConfirmation(
  payload: SendConfirmationPayload
): Promise<NotificationResult> {
  const { email, phoneNumber, type, bookingDetails, userDetails } = payload;

  let emailSent = false;
  let smsSent = false;
  let sentMethod: "email" | "sms" | "both" = "email";
  let subject = "";
  let emailContent = "";
  let smsContent = "";

  try {
    const confirmationId = Math.random().toString(36).substr(2, 9);

    // Generate confirmation content based on type
    if (type === "bed_booking" && bookingDetails) {
      if (email) {
        const htmlContent = generateBedBookingEmail(
          userDetails?.fullName || "User",
          bookingDetails.hospitalName,
          bookingDetails.bedType,
          bookingDetails.checkInDate,
          confirmationId
        );
        emailSent = await sendEmail({
          to: email,
          subject: "Bed Booking Confirmation - CarePoint",
          html: htmlContent,
        });
        sentMethod = "email";
      }

      smsContent = `Your bed booking at ${bookingDetails.hospitalName} (${bookingDetails.bedType}) for ${bookingDetails.checkInDate} has been received. You'll get confirmation soon.`;
    } else if (type === "account_creation") {
      if (email) {
        const htmlContent = generateAccountCreationEmail(
          userDetails?.fullName || "User",
          email
        );
        emailSent = await sendEmail({
          to: email,
          subject: "Welcome to CarePoint - Account Created Successfully",
          html: htmlContent,
        });
        sentMethod = "email";
      }

      smsContent = "Welcome to CarePoint! Your account is ready. Download the app to book hospitals and doctors.";
    } else if (type === "login_verification") {
      const verificationCode = Math.random().toString().slice(2, 8);

      if (email) {
        const htmlContent = generateLoginVerificationEmail(
          email,
          verificationCode
        );
        emailSent = await sendEmail({
          to: email,
          subject: "CarePoint Login Verification Code",
          html: htmlContent,
        });
        sentMethod = "email";
      }

      smsContent = `Your CarePoint verification code is: ${verificationCode}. Valid for 10 minutes.`;
    }

    // Store SMS confirmation if phone is provided and email wasn't sent
    if (phoneNumber && !emailSent) {
      smsSent = true;
      sentMethod = "sms";
    } else if (phoneNumber && emailSent) {
      smsSent = true;
      sentMethod = "both";
    }

    // At least one confirmation must be sent
    if (!emailSent && !smsSent) {
      return {
        success: false,
        method: "email",
        emailSent: false,
        smsSent: false,
        message: "No valid contact information provided. Please provide either email or phone number.",
      };
    }

    return {
      success: true,
      method: sentMethod,
      emailSent,
      smsSent,
      message: `Confirmation sent via ${sentMethod}`,
      confirmationId,
    };
  } catch (error) {
    console.error("Error sending confirmation:", error);
    return {
      success: false,
      method: "email",
      emailSent: false,
      smsSent: false,
      message: "Failed to send confirmation. Please try again later.",
    };
  }
}
