// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Supabase client (service role key ile)
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const RESEND_API_URL = "https://api.resend.com/emails";

serve(async (req) => {
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

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/appointment-notify' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
