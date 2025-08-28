import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const payload = await req.json(); // Yeni appointment kaydı

    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) throw new Error(error.message);
    if (!users) throw new Error("No users found");

    const adminEmails = users.users.map(u => u.email);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      }
    });

    for (const email of adminEmails) {
      await transporter.sendMail({
        from: `"Başakşehir Evlere Sağlık" <${process.env.GMAIL_USERNAME}>`,
        to: email!,
        subject: "Yeni Randevu Talebi",
        html: `
          <h2>Yeni Randevu Talebi</h2>
          <p><b>İsim:</b> ${payload.first_name} ${payload.last_name}</p>
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
