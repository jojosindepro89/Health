// src/app/api/dashboard/stats/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, unauthorised } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return unauthorised();

  const [
    totalPatients, activePatients, admittedPatients,
    pendingConsultations, inProgressConsultations,
    pendingLab, completedLab,
    pendingRx,
    totalRevenue, paidRevenue, pendingRevenue,
    activeAdmissions,
    recentPatients,
    recentConsultations,
  ] = await Promise.all([
    db.patient.count(),
    db.patient.count({ where: { status: 'Active' } }),
    db.patient.count({ where: { status: 'Admitted' } }),
    db.consultation.count({ where: { status: 'Waiting' } }),
    db.consultation.count({ where: { status: 'In Progress' } }),
    db.labRequest.count({ where: { status: 'Pending' } }),
    db.labRequest.count({ where: { status: 'Completed' } }),
    db.prescription.count({ where: { status: 'Pending' } }),
    db.invoice.aggregate({ _sum: { amount: true } }),
    db.invoice.aggregate({ _sum: { paid: true } }),
    db.invoice.aggregate({ _sum: { amount: true }, where: { status: { in: ['Pending', 'Part-Paid'] } } }),
    db.admission.count({ where: { dischargedAt: null } }),
    db.patient.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    db.consultation.findMany({
      orderBy: { createdAt: 'desc' }, take: 5,
      include: { patient: { select: { firstName: true, lastName: true, patientCode: true } } },
    }),
  ]);

  // Build system alerts after the queries have resolved
  const systemAlerts = [
    pendingLab > 0 ? `Lab results pending for ${pendingLab} patients` : null,
    admittedPatients > 0 ? `${admittedPatients} beds currently occupied` : null,
    pendingRx > 0 ? `${pendingRx} prescriptions awaiting dispensing` : null,
  ].filter(Boolean);

  return Response.json({
    stats: {
      totalPatients,
      activePatients,
      admittedPatients,
      pendingConsultations,
      inProgressConsultations,
      pendingLab,
      completedLab,
      pendingRx,
      totalRevenue: totalRevenue._sum.amount || 0,
      paidRevenue: paidRevenue._sum.paid || 0,
      pendingRevenue: pendingRevenue._sum.amount || 0,
      activeAdmissions,
    },
    recentPatients,
    recentConsultations,
    alerts: systemAlerts,
  });
}
