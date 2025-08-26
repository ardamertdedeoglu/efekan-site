// pages/api/send-appointment-email.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const RESEND_API_URL = "https://api.resend.com/emails";

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const payload = req.body;

  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) throw new Error(error.message);

    const adminEmails = users.users.map(u => u.email).filter(Boolean);

    for (const email of adminEmails) {
      await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "snmded83@gmail.com",
          to: email,
          subject: "Yeni Randevu Talebi",
          html: `
            <h2>Yeni Randevu Talebi</h2>
            <p><b>İsim:</b> ${payload.name} ${payload.surname}</p>
            <p><b>Telefon:</b> ${payload.phone}</p>
            <p><b>Email:</b> ${payload.email}</p>
            <p><b>Adres:</b> ${payload.address || "Belirtilmemiş"}</p>
            <p><b>Şikayet:</b> ${payload.complaint || "Belirtilmemiş"}</p>
          `,
        }),
      });
    }

    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Bilinmeyen hata" });
  }
}
