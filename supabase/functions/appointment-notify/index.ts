
import {corsHeaders} from "../../_shared/cors.ts";
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Supabase client (service role key ile)
const supabase = createClient(
  process.env.get("SUPABASE_URL")!,
  process.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const RESEND_API_KEY = process.env.get("RESEND_API_KEY")!;
const RESEND_API_URL = "https://api.resend.com/emails";

serve(async (req) => {

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  try {
    const payload = await req.json(); // appointments kaydı

    // Tüm admin kullanıcıların mail adreslerini çek
    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) throw new Error(error.message);

    // Sadece aktif adminleri al (opsiyonel filter)
    const adminEmails = users.users.map(u => u.email).filter(Boolean);

    // Her admin için mail gönder
    for (const email of adminEmails) {
      await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          ...corsHeaders,
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

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
});
