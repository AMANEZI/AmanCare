import { Router, Request, Response } from "express";
import { sendConfirmation } from "../services/notificationService";

const router = Router();

interface SendConfirmationRequest {
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

router.post("/send-confirmation", async (req: Request, res: Response) => {
  try {
    const {
      email,
      phoneNumber,
      type,
      bookingDetails,
      userDetails,
    }: SendConfirmationRequest = req.body;

    // Validate input
    if (!email && !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "At least one contact method (email or phone) is required",
      });
    }

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Notification type is required",
      });
    }

    // Send confirmation
    const result = await sendConfirmation({
      email,
      phoneNumber,
      type,
      bookingDetails,
      userDetails,
    });

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error("Error in send-confirmation route:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send confirmation",
    });
  }
});

export const notificationRouter = router;
