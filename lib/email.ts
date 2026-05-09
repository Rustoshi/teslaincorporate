import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.zoho.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const FROM_EMAIL = (process.env.SMTP_FROM_EMAIL || SMTP_USER).trim();
const FROM_NAME = (process.env.SMTP_FROM_NAME || "Musk Space").trim();

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

export async function sendEmail({
    to,
    subject,
    htmlbody,
}: {
    to: string;
    subject: string;
    htmlbody: string;
}) {
    if (!SMTP_USER || !SMTP_PASS) {
        console.error("[sendEmail] SMTP credentials are not configured.");
        throw new Error("Email service is not configured.");
    }

    try {
        await transporter.sendMail({
            from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
            to,
            subject,
            html: htmlbody,
        });
    } catch (err: any) {
        console.error("[sendEmail] SMTP error:", err.message);
        throw new Error(`Failed to send email: ${err.message}`);
    }
}

export function buildRegistrationOtpEmail(firstName: string, otp: string): string {
    return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0a0a0a; color: #ffffff; border-radius: 12px;">
  <h1 style="font-size: 22px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 4px;">
    Musk <span style="color: #e82127;">Space</span>
  </h1>
  <p style="color: #555; font-size: 12px; margin: 0 0 28px; letter-spacing: 2px; text-transform: uppercase;">Investment Platform</p>
  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 28px;" />

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">Verify Your Email, ${firstName}</h2>
  <p style="color: #aaa; line-height: 1.7; margin: 0 0 24px;">
    Thank you for registering with Musk Space. Please use the verification code below to complete your account setup.
  </p>

  <div style="background: #111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 24px; margin-bottom: 24px; text-align: center;">
    <p style="margin: 0 0 8px; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
    <p style="margin: 0; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #ffffff; font-family: monospace;">${otp}</p>
  </div>

  <p style="color: #888; font-size: 13px; margin-bottom: 20px;">
    This code will expire in <strong style="color: #fff;">10 minutes</strong>. If you did not create this account, please disregard this email.
  </p>

  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 20px;" />
  <p style="color: #444; font-size: 11px; margin: 0;">Do not share this code with anyone. &copy; Musk Space</p>
</div>`;
}

export function buildWelcomeEmail(firstName: string): string {
    const loginUrl = `${process.env.NEXTAUTH_URL || "https://muskspaceinc.com"}/invest/login`;
    return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0a0a0a; color: #ffffff; border-radius: 12px;">
  <h1 style="font-size: 22px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 4px;">
    Musk <span style="color: #e82127;">Space</span>
  </h1>
  <p style="color: #555; font-size: 12px; margin: 0 0 28px; letter-spacing: 2px; text-transform: uppercase;">Investment Platform</p>
  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 28px;" />

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">Welcome, ${firstName}!</h2>
  <p style="color: #aaa; line-height: 1.7; margin: 0 0 24px;">
    Your Musk Space account is active and ready to use. You can log in and start building your portfolio right now.
  </p>

  <div style="background: #0d1f0d; border: 1px solid #1a3a1a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
    <p style="margin: 0 0 8px; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Account Status</p>
    <p style="margin: 0; font-size: 16px; font-weight: bold; color: #22c55e;">Active</p>
  </div>

  <p style="color: #888; font-size: 13px; margin-bottom: 8px;">You now have full access to:</p>
  <ul style="color: #888; font-size: 13px; line-height: 2; padding-left: 20px; margin: 0 0 28px;">
    <li>AI-powered investment plans with competitive returns</li>
    <li>Deposits, withdrawals &amp; portfolio management</li>
    <li>Exclusive vehicle and energy product financing</li>
    <li>Real-time transaction tracking and analytics</li>
  </ul>

  <a href="${loginUrl}" style="display: inline-block; background-color: #e82127; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 13px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 28px;">
    Go to Dashboard
  </a>

  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 20px;" />
  <p style="color: #444; font-size: 11px; margin: 0;">If you did not create this account, please disregard this email. &copy; Musk Space</p>
</div>`;
}

export function buildMembershipReceivedEmail(firstName: string, tierName: string): string {
    return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0a0a0a; color: #ffffff; border-radius: 12px;">
  <h1 style="font-size: 22px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 4px;">
    Musk <span style="color: #e82127;">Space</span>
  </h1>
  <p style="color: #555; font-size: 12px; margin: 0 0 28px; letter-spacing: 2px; text-transform: uppercase;">Membership Program</p>
  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 28px;" />

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">Application Received, ${firstName}!</h2>
  <p style="color: #aaa; line-height: 1.7; margin: 0 0 24px;">
    We've received your application for the <strong style="color: #fff;">${tierName}</strong> Membership Card. Our team is reviewing your application and will notify you of the decision shortly.
  </p>

  <div style="background: #111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
    <p style="margin: 0 0 8px; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Application Status</p>
    <p style="margin: 0; font-size: 16px; font-weight: bold; color: #f59e0b;">Under Review</p>
    <p style="margin: 8px 0 0; font-size: 13px; color: #666;">This typically takes 1–3 business days.</p>
  </div>

  <p style="color: #888; font-size: 13px; margin-bottom: 8px;">You can check the status of your application at any time in your dashboard under <strong style="color: #aaa;">Membership Card</strong>.</p>

  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 20px;" />
  <p style="color: #444; font-size: 11px; margin: 0;">If you did not submit this application, please contact support immediately. &copy; Musk Space</p>
</div>`;
}

export function buildMembershipApprovedEmail(
    firstName: string,
    tierName: string,
    cardNumber: string,
    expiresAt: string
): string {
    const dashboardUrl = `${process.env.NEXTAUTH_URL || 'https://muskspace.pro'}/dashboard/membership`;
    return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0a0a0a; color: #ffffff; border-radius: 12px;">
  <h1 style="font-size: 22px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 4px;">
    Musk <span style="color: #e82127;">Space</span>
  </h1>
  <p style="color: #555; font-size: 12px; margin: 0 0 28px; letter-spacing: 2px; text-transform: uppercase;">Membership Program</p>
  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 28px;" />

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">Congratulations, ${firstName}! 🎉</h2>
  <p style="color: #aaa; line-height: 1.7; margin: 0 0 24px;">
    Your application for the <strong style="color: #fff;">${tierName}</strong> Membership Card has been approved. Your exclusive card is now active and ready to use.
  </p>

  <div style="background: #0d1a0d; border: 1px solid #1a3a1a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
    <p style="margin: 0 0 8px; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Your Card Details</p>
    <p style="margin: 0 0 6px; font-size: 14px; color: #22c55e; font-weight: bold; text-transform: uppercase;">${tierName}</p>
    <p style="margin: 0 0 4px; font-size: 13px; font-family: monospace; color: #aaa; letter-spacing: 2px;">${cardNumber}</p>
    <p style="margin: 0; font-size: 12px; color: #666;">Valid through: ${expiresAt}</p>
  </div>

  <a href="${dashboardUrl}" style="display: inline-block; background-color: #e82127; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 13px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 28px;">
    View Your Membership Card
  </a>

  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 20px;" />
  <p style="color: #444; font-size: 11px; margin: 0;">Thank you for being a valued member. &copy; Musk Space</p>
</div>`;
}

export function buildMembershipRejectedEmail(
    firstName: string,
    tierName: string,
    reason?: string
): string {
    const dashboardUrl = `${process.env.NEXTAUTH_URL || 'https://muskspace.pro'}/dashboard/membership`;
    return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0a0a0a; color: #ffffff; border-radius: 12px;">
  <h1 style="font-size: 22px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 4px;">
    Musk <span style="color: #e82127;">Space</span>
  </h1>
  <p style="color: #555; font-size: 12px; margin: 0 0 28px; letter-spacing: 2px; text-transform: uppercase;">Membership Program</p>
  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 28px;" />

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">Application Update, ${firstName}</h2>
  <p style="color: #aaa; line-height: 1.7; margin: 0 0 24px;">
    After careful review, we regret to inform you that your application for the <strong style="color: #fff;">${tierName}</strong> Membership Card was not approved at this time.
  </p>

  ${reason ? `
  <div style="background: #1a0d0d; border: 1px solid #3a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
    <p style="margin: 0 0 8px; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Review Notes</p>
    <p style="margin: 0; font-size: 14px; color: #f87171; line-height: 1.6;">${reason}</p>
  </div>
  ` : ''}

  <p style="color: #888; font-size: 13px; margin-bottom: 20px;">
    You are welcome to re-apply or consider applying for a different membership tier. Visit your dashboard for more options.
  </p>

  <a href="${dashboardUrl}" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 13px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 28px; border: 1px solid #333;">
    View Membership Options
  </a>

  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 20px;" />
  <p style="color: #444; font-size: 11px; margin: 0;">If you believe this was an error, please contact our support team. &copy; Musk Space</p>
</div>`;
}

// ── Deposit Email Templates ──

export function buildDepositPendingEmail(firstName: string, amount: string, method: string): string {
    return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0a0a0a; color: #ffffff; border-radius: 12px;">
  <h1 style="font-size: 22px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 4px;">
    Musk <span style="color: #e82127;">Space</span>
  </h1>
  <p style="color: #555; font-size: 12px; margin: 0 0 28px; letter-spacing: 2px; text-transform: uppercase;">Investment Platform</p>
  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 28px;" />

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">Deposit Received, ${firstName}</h2>
  <p style="color: #aaa; line-height: 1.7; margin: 0 0 24px;">
    We have received your deposit request and it is currently being reviewed by our team.
  </p>

  <div style="background: #111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Amount</td>
        <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #fff; text-align: right;">${amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Method</td>
        <td style="padding: 8px 0; font-size: 14px; color: #aaa; text-align: right;">${method}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Status</td>
        <td style="padding: 8px 0; font-size: 14px; font-weight: bold; color: #f59e0b; text-align: right;">Pending Review</td>
      </tr>
    </table>
  </div>

  <p style="color: #888; font-size: 13px; margin-bottom: 20px;">
    You will receive a confirmation email once your deposit has been processed. This typically takes a few minutes to a few hours.
  </p>

  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 20px;" />
  <p style="color: #444; font-size: 11px; margin: 0;">If you did not make this deposit, please contact support immediately. &copy; Musk Space</p>
</div>`;
}

export function buildDepositApprovedEmail(firstName: string, amount: string, method: string): string {
    const dashboardUrl = `${process.env.NEXTAUTH_URL || 'https://muskspace.pro'}/dashboard`;
    return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0a0a0a; color: #ffffff; border-radius: 12px;">
  <h1 style="font-size: 22px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 4px;">
    Musk <span style="color: #e82127;">Space</span>
  </h1>
  <p style="color: #555; font-size: 12px; margin: 0 0 28px; letter-spacing: 2px; text-transform: uppercase;">Investment Platform</p>
  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 28px;" />

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">Deposit Approved, ${firstName}!</h2>
  <p style="color: #aaa; line-height: 1.7; margin: 0 0 24px;">
    Your deposit has been confirmed and your account has been credited. The funds are now available in your balance.
  </p>

  <div style="background: #0d1f0d; border: 1px solid #1a3a1a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Amount</td>
        <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #22c55e; text-align: right;">${amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Method</td>
        <td style="padding: 8px 0; font-size: 14px; color: #aaa; text-align: right;">${method}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Status</td>
        <td style="padding: 8px 0; font-size: 14px; font-weight: bold; color: #22c55e; text-align: right;">Approved</td>
      </tr>
    </table>
  </div>

  <a href="${dashboardUrl}" style="display: inline-block; background-color: #e82127; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 13px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 28px;">
    Go to Dashboard
  </a>

  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 20px;" />
  <p style="color: #444; font-size: 11px; margin: 0;">Thank you for investing with us. &copy; Musk Space</p>
</div>`;
}

export function buildDepositRejectedEmail(firstName: string, amount: string, method: string): string {
    return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0a0a0a; color: #ffffff; border-radius: 12px;">
  <h1 style="font-size: 22px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 4px;">
    Musk <span style="color: #e82127;">Space</span>
  </h1>
  <p style="color: #555; font-size: 12px; margin: 0 0 28px; letter-spacing: 2px; text-transform: uppercase;">Investment Platform</p>
  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 28px;" />

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">Deposit Not Approved, ${firstName}</h2>
  <p style="color: #aaa; line-height: 1.7; margin: 0 0 24px;">
    Unfortunately, your deposit could not be verified and has been declined. This may be due to an invalid payment proof or a processing issue.
  </p>

  <div style="background: #1a0d0d; border: 1px solid #3a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Amount</td>
        <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #fff; text-align: right;">${amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Method</td>
        <td style="padding: 8px 0; font-size: 14px; color: #aaa; text-align: right;">${method}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Status</td>
        <td style="padding: 8px 0; font-size: 14px; font-weight: bold; color: #f87171; text-align: right;">Rejected</td>
      </tr>
    </table>
  </div>

  <p style="color: #888; font-size: 13px; margin-bottom: 20px;">
    Please ensure your payment proof is clear and matches the deposit details. You may try again or contact support for assistance.
  </p>

  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 20px;" />
  <p style="color: #444; font-size: 11px; margin: 0;">If you believe this was an error, please contact our support team. &copy; Musk Space</p>
</div>`;
}

// ── Withdrawal Email Templates ──

export function buildWithdrawalPendingEmail(firstName: string, amount: string, method: string, walletAddress: string): string {
    return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0a0a0a; color: #ffffff; border-radius: 12px;">
  <h1 style="font-size: 22px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 4px;">
    Musk <span style="color: #e82127;">Space</span>
  </h1>
  <p style="color: #555; font-size: 12px; margin: 0 0 28px; letter-spacing: 2px; text-transform: uppercase;">Investment Platform</p>
  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 28px;" />

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">Withdrawal Request Submitted, ${firstName}</h2>
  <p style="color: #aaa; line-height: 1.7; margin: 0 0 24px;">
    Your withdrawal request has been submitted and is pending review. Our team will process it shortly.
  </p>

  <div style="background: #111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Amount</td>
        <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #fff; text-align: right;">${amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Method</td>
        <td style="padding: 8px 0; font-size: 14px; color: #aaa; text-align: right;">${method}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Wallet</td>
        <td style="padding: 8px 0; font-size: 12px; color: #aaa; text-align: right; word-break: break-all; font-family: monospace;">${walletAddress}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Status</td>
        <td style="padding: 8px 0; font-size: 14px; font-weight: bold; color: #f59e0b; text-align: right;">Pending</td>
      </tr>
    </table>
  </div>

  <p style="color: #888; font-size: 13px; margin-bottom: 20px;">
    You will receive a confirmation email once your withdrawal has been processed. The amount has been deducted from your available balance.
  </p>

  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 20px;" />
  <p style="color: #444; font-size: 11px; margin: 0;">If you did not request this withdrawal, please contact support immediately. &copy; Musk Space</p>
</div>`;
}

export function buildWithdrawalApprovedEmail(firstName: string, amount: string, method: string, walletAddress: string): string {
    return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0a0a0a; color: #ffffff; border-radius: 12px;">
  <h1 style="font-size: 22px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 4px;">
    Musk <span style="color: #e82127;">Space</span>
  </h1>
  <p style="color: #555; font-size: 12px; margin: 0 0 28px; letter-spacing: 2px; text-transform: uppercase;">Investment Platform</p>
  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 28px;" />

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">Withdrawal Approved, ${firstName}!</h2>
  <p style="color: #aaa; line-height: 1.7; margin: 0 0 24px;">
    Your withdrawal has been approved and the funds have been sent to your wallet. Please allow some time for the blockchain network to confirm the transaction.
  </p>

  <div style="background: #0d1f0d; border: 1px solid #1a3a1a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Amount</td>
        <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #22c55e; text-align: right;">${amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Method</td>
        <td style="padding: 8px 0; font-size: 14px; color: #aaa; text-align: right;">${method}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Wallet</td>
        <td style="padding: 8px 0; font-size: 12px; color: #aaa; text-align: right; word-break: break-all; font-family: monospace;">${walletAddress}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Status</td>
        <td style="padding: 8px 0; font-size: 14px; font-weight: bold; color: #22c55e; text-align: right;">Approved</td>
      </tr>
    </table>
  </div>

  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 20px;" />
  <p style="color: #444; font-size: 11px; margin: 0;">Thank you for using Musk Space. &copy; Musk Space</p>
</div>`;
}

export function buildWithdrawalRejectedEmail(firstName: string, amount: string, method: string): string {
    return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0a0a0a; color: #ffffff; border-radius: 12px;">
  <h1 style="font-size: 22px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 4px;">
    Musk <span style="color: #e82127;">Space</span>
  </h1>
  <p style="color: #555; font-size: 12px; margin: 0 0 28px; letter-spacing: 2px; text-transform: uppercase;">Investment Platform</p>
  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 28px;" />

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">Withdrawal Declined, ${firstName}</h2>
  <p style="color: #aaa; line-height: 1.7; margin: 0 0 24px;">
    Your withdrawal request has been declined. The funds have been returned to your account balance.
  </p>

  <div style="background: #1a0d0d; border: 1px solid #3a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Amount</td>
        <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #fff; text-align: right;">${amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Method</td>
        <td style="padding: 8px 0; font-size: 14px; color: #aaa; text-align: right;">${method}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Status</td>
        <td style="padding: 8px 0; font-size: 14px; font-weight: bold; color: #f87171; text-align: right;">Rejected</td>
      </tr>
    </table>
  </div>

  <p style="color: #888; font-size: 13px; margin-bottom: 20px;">
    If you have any questions, please contact our support team for further assistance.
  </p>

  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 20px;" />
  <p style="color: #444; font-size: 11px; margin: 0;">If you believe this was an error, please contact support. &copy; Musk Space</p>
</div>`;
}

// ── Referral Email Templates ──

export function buildReferralSignupEmail(referrerName: string, refereeName: string, bonusAmount: string = '$10'): string {
    return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0a0a0a; color: #ffffff; border-radius: 12px;">
  <h1 style="font-size: 22px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 4px;">
    Musk <span style="color: #e82127;">Space</span>
  </h1>
  <p style="color: #555; font-size: 12px; margin: 0 0 28px; letter-spacing: 2px; text-transform: uppercase;">Referral Program</p>
  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 28px;" />

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">New Referral, ${referrerName}!</h2>
  <p style="color: #aaa; line-height: 1.7; margin: 0 0 24px;">
    Great news! <strong style="color: #fff;">${refereeName}</strong> just signed up using your referral code. Once they make their first deposit, you'll earn a <strong style="color: #22c55e;">${bonusAmount} bonus</strong> credited directly to your balance.
  </p>

  <div style="background: #111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
    <p style="margin: 0 0 8px; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Referral Status</p>
    <p style="margin: 0; font-size: 14px; font-weight: bold; color: #f59e0b;">Pending First Deposit</p>
  </div>

  <p style="color: #888; font-size: 13px; margin-bottom: 20px;">
    Keep sharing your referral code to earn more rewards. You can find your code in the Referrals section of your dashboard.
  </p>

  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 20px;" />
  <p style="color: #444; font-size: 11px; margin: 0;">&copy; Musk Space</p>
</div>`;
}

export function buildReferralRewardEmail(referrerName: string, refereeName: string, bonusAmount: string): string {
    return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0a0a0a; color: #ffffff; border-radius: 12px;">
  <h1 style="font-size: 22px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 4px;">
    Musk <span style="color: #e82127;">Space</span>
  </h1>
  <p style="color: #555; font-size: 12px; margin: 0 0 28px; letter-spacing: 2px; text-transform: uppercase;">Referral Program</p>
  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 28px;" />

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">Referral Reward Earned, ${referrerName}!</h2>
  <p style="color: #aaa; line-height: 1.7; margin: 0 0 24px;">
    Your referral <strong style="color: #fff;">${refereeName}</strong> has made their first deposit. Your bonus has been credited to your account!
  </p>

  <div style="background: #0d1f0d; border: 1px solid #1a3a1a; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
    <p style="margin: 0 0 8px; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Bonus Credited</p>
    <p style="margin: 0; font-size: 28px; font-weight: bold; color: #22c55e;">${bonusAmount}</p>
  </div>

  <p style="color: #888; font-size: 13px; margin-bottom: 20px;">
    The bonus has been added to your total balance. Keep referring friends to earn more!
  </p>

  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 20px;" />
  <p style="color: #444; font-size: 11px; margin: 0;">&copy; Musk Space</p>
</div>`;
}

export function buildApprovalEmail(firstName: string): string {
    const loginUrl = `${process.env.NEXTAUTH_URL || "https://muskspace.pro"}/invest/login`;
    return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0a0a0a; color: #ffffff; border-radius: 12px;">
  <h1 style="font-size: 22px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 4px;">
    Musk <span style="color: #e82127;">Space</span>
  </h1>
  <p style="color: #555; font-size: 12px; margin: 0 0 28px; letter-spacing: 2px; text-transform: uppercase;">Investment Platform</p>
  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 28px;" />

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px;">Your Account is Approved, ${firstName}!</h2>
  <p style="color: #aaa; line-height: 1.7; margin: 0 0 24px;">
    Great news! Your Musk Space account has been reviewed and approved. You now have full access to the platform and can start investing today.
  </p>

  <div style="background: #0d1f0d; border: 1px solid #1a3a1a; border-radius: 8px; padding: 20px; margin-bottom: 28px;">
    <p style="margin: 0 0 8px; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Account Status</p>
    <p style="margin: 0; font-size: 16px; font-weight: bold; color: #22c55e;">Active</p>
  </div>

  <a href="${loginUrl}" style="display: inline-block; background-color: #e82127; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 13px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 28px;">
    Log In to Your Account
  </a>

  <hr style="border: none; border-top: 1px solid #222; margin-bottom: 20px;" />
  <p style="color: #444; font-size: 11px; margin: 0;">If you did not create this account, please contact support. &copy; Musk Space</p>
</div>`;
}
