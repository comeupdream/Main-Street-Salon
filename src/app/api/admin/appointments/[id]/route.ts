import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { isAppointmentStatus } from "@/lib/appointment-status";
import { isAdminAuthed } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidDateISO, isValidTime } from "@/lib/time";

type Ctx = { params: Promise<{ id: string }> };

/** PATCH /api/admin/appointments/:id — update status or details. */
export async function PATCH(req: Request, ctx: Ctx) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const data: Prisma.AppointmentUpdateInput = {};

  if (body.status !== undefined) {
    if (!isAppointmentStatus(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    data.status = body.status;
  }
  if (body.customerName !== undefined) data.customerName = String(body.customerName);
  if (body.customerEmail !== undefined) data.customerEmail = String(body.customerEmail);
  if (body.customerPhone !== undefined) data.customerPhone = String(body.customerPhone);
  if (body.notes !== undefined) data.notes = String(body.notes);
  if (body.date !== undefined) {
    if (!isValidDateISO(String(body.date)))
      return NextResponse.json({ error: "Invalid date." }, { status: 400 });
    data.date = String(body.date);
  }
  if (body.startTime !== undefined) {
    if (!isValidTime(String(body.startTime)))
      return NextResponse.json({ error: "Invalid time." }, { status: 400 });
    data.startTime = String(body.startTime);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    const appointment = await prisma.appointment.update({ where: { id }, data });
    return NextResponse.json({ ok: true, appointment });
  } catch {
    return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  }
}

/** DELETE /api/admin/appointments/:id — remove an appointment. */
export async function DELETE(_req: Request, ctx: Ctx) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  try {
    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  }
}
