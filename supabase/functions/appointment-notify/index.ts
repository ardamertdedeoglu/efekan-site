import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Resend } from "npm:resend" // veya SendGrid/SMTP

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // Servis rolü gerekiyor
)

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!)

serve(async (req) => {
  const { type, record } = await req.json()

  if (type === "INSERT") {
    const { first_name, last_name, email, phone, address, complaint } = record

    // auth.users'dan tüm admin mailleri çek
    const { data: admins, error } = await supabase.auth.admin.listUsers()

    if (error) {
      console.error("Admin listesi alınamadı:", error)
      return new Response("Hata", { status: 500 })
    }

    const adminEmails = admins.users.map((u) => u.email).filter(Boolean)

    const subject = `Yeni Randevu Talebi: ${first_name} ${last_name}`
    const body = `
      Yeni bir randevu talebi alındı:
      İsim: ${first_name} ${last_name}
      Telefon: ${phone}
      Email: ${email}
      Adres: ${address}
      Şikayet: ${complaint}
    `

    for (const to of adminEmails) {
      await resend.emails.send({
        from: "noreply@seninsiten.com",
        to: to!,
        subject,
        text: body,
      })
    }
  }

  return new Response("OK", { status: 200 })
})
