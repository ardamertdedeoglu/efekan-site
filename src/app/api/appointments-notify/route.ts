import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const payload = await req.json(); // Yeni appointment kaydı

    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) throw new Error(error.message);
    if (!users) throw new Error("No users found");

    const adminEmails = users.users.map(u => u.email).filter(Boolean);

    for (const email of adminEmails) {
      await resend.emails.send({
        from: "snmded83@gmail.com",
        to: email!,
        subject: "Yeni Randevu Talebi",
        html: `
          <h2>Yeni Randevu Talebi</h2>
          <p><b>İsim:</b> ${payload.name} ${payload.surname}</p>
          <p><b>Telefon:</b> ${payload.phone}</p>
          <p><b>Email:</b> ${payload.email}</p>
          <p><b>Adres:</b> ${payload.address || "Belirtilmemiş"}</p>
          <p><b>Şikayet:</b> ${payload.complaint || "Belirtilmemiş"}</p>
        `,
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
