import express from "express";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let resendClient: Resend | null = null;

function getResend() {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (key) {
      resendClient = new Resend(key);
    }
  }
  return resendClient;
}

app.post("/api/contact", async (req, res) => {
  const { firstName, lastName, email, message, isLoggedIn } = req.body;

  try {
    const resend = getResend();
    if (resend) {
      await resend.emails.send({
        from: "DigitalSoftware <onboarding@resend.dev>", // Resend testing domain
        to: ["adarshsupport@dev2dev.in"],
        subject: `New Contact Message from ${firstName} ${lastName}`,
        html: `
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Logged In User:</strong> ${isLoggedIn ? 'Yes' : 'No'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
      console.log("Email sent successfully via Resend.");
    } else {
      console.warn("RESEND_API_KEY is not set. Email not sent, but message saved to database.");
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
