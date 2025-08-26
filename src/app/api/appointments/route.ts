import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getSupabaseFromRequest(req: Request) {
  const url = process.env.SUPABASE_URL as string;
  const anon = process.env.SUPABASE_ANON_KEY as string;
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;
  return createClient(
    url,
    anon,
    token
      ? { global: { headers: { Authorization: `Bearer ${token}` } } }
      : undefined,
  );
}

export async function POST(req: Request) {
  const body = await req.json();
  const { first_name, last_name, phone, email, address, complaint } = body;

  const supabase = getSupabaseFromRequest(req);
  const { error } = await supabase
    .from("appointments")
    .insert([{ first_name, last_name, phone, email, address, complaint }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Randevu başarıyla oluşturuldu!" });
}

export async function GET(req: Request) {
  const supabase = getSupabaseFromRequest(req);
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const supabase = getSupabaseFromRequest(req);
  const { error } = await supabase.from("appointments").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Randevu başarıyla silindi!" });
}
