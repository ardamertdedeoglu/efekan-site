import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const RESEND_API_URL = "https://api.resend.com/emails";

export async function POST(req: Request) {
  try {
    const payload = await req.json(); // Yeni appointment kaydı

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
          from: "noreply@yourdomain.com",
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

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}
