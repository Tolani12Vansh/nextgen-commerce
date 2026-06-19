import { NextResponse } from 'next/server';
import { transporter } from '../../../lib/mailer';

export async function POST(request) {
  try {
    const { email, customerName, orderId, totalAmount } = await request.json();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Customer ka email jo form me fill kiya tha
      subject: `🎉 Order Confirmation - #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #2563eb; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0;">Payment Successful!</h1>
          </div>
          <div style="padding: 32px; background-color: #ffffff;">
            <h2 style="color: #111827; margin-top: 0;">Hi ${customerName},</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              Thank you for your order! We've received your payment of <strong>$${totalAmount}</strong> and are getting your items ready for shipment.
            </p>
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
              <p style="margin: 0; color: #4b5563; font-size: 14px;">Order ID</p>
              <p style="margin: 4px 0 0 0; color: #111827; font-size: 18px; font-weight: bold; font-family: monospace;">#${orderId}</p>
            </div>
            <p style="color: #4b5563; font-size: 14px;">If you have any questions, simply reply to this email.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    return NextResponse.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}