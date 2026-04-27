// src/app/api/seed/route.ts
// POST /api/seed — seeds the database with demo data (run once)
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  // Safety check: only allow seeding if no users exist
  const userCount = await db.user.count();
  if (userCount > 0) {
    return Response.json({ message: 'Database already seeded', userCount }, { status: 200 });
  }

  // Create default admin users
  const [admin, desk] = await Promise.all([
    db.user.create({
      data: {
        name: 'Admin Grabbo',
        email: 'admin@dhs.ng',
        password: await bcrypt.hash('admin123', 12),
        role: 'super_admin',
        hospital: 'Grabbo Fertility Clinic',
      },
    }),
    db.user.create({
      data: {
        name: 'Front Desk User',
        email: 'desk@dhs.ng',
        password: await bcrypt.hash('desk123', 12),
        role: 'front_desk',
        hospital: 'Grabbo Fertility Clinic',
      },
    }),
  ]);

  // Create seed patients
  const patients = await db.$transaction([
    db.patient.create({ data: { patientCode: 'P-00421', firstName: 'Adaeze', lastName: 'Okafor', age: 34, gender: 'F', phone: '08012345678', email: 'adaeze@mail.com', hmo: 'NHIS', dept: 'General OPD', address: '12 Lagos St, Abuja', bloodGroup: 'O+', status: 'Active' } }),
    db.patient.create({ data: { patientCode: 'P-00420', firstName: 'Emeka', lastName: 'Nwachukwu', age: 52, gender: 'M', phone: '07098765432', email: 'emeka@mail.com', hmo: 'AXA Mansard', dept: 'Emergency', address: '5 Kano Rd, Lagos', bloodGroup: 'A+', status: 'Admitted' } }),
    db.patient.create({ data: { patientCode: 'P-00419', firstName: 'Fatima', lastName: 'Bello', age: 28, gender: 'F', phone: '09011223344', email: 'fatima@mail.com', hmo: 'Hygeia', dept: 'Antenatal', address: '8 Zaria Ave, Kano', bloodGroup: 'B+', status: 'Active' } }),
    db.patient.create({ data: { patientCode: 'P-00418', firstName: 'Chidi', lastName: 'Eze', age: 45, gender: 'M', phone: '08123456789', email: 'chidi@mail.com', hmo: 'Self Pay', dept: 'Surgery', address: '22 Enugu St, PH', bloodGroup: 'AB+', status: 'Admitted' } }),
    db.patient.create({ data: { patientCode: 'P-00417', firstName: 'Ngozi', lastName: 'Umeh', age: 7, gender: 'F', phone: '08187654321', email: 'ngozi@mail.com', hmo: 'NHIS', dept: 'Paediatrics', address: '3 Owerri Rd, Imo', bloodGroup: 'O-', status: 'Discharged' } }),
    db.patient.create({ data: { patientCode: 'P-00416', firstName: 'Babatunde', lastName: 'Adeyemi', age: 61, gender: 'M', phone: '07012987654', email: 'baba@mail.com', hmo: 'Leadway', dept: 'Cardiology', address: '9 Ibadan Rd, Oyo', bloodGroup: 'A-', status: 'Active' } }),
  ]);

  const [p421, p420, p419, p418, p417, p416] = patients;

  // Consultations
  await db.$transaction([
    db.consultation.create({ data: { consultCode: 'C-1042', patientId: p420.id, doctorId: admin.id, doctorName: 'Dr. A. Peters', dept: 'Emergency', complaint: 'Severe headache', diagnosis: 'Hypertensive Crisis', notes: 'BP 200/120. Started IV labetolol.', priority: 'Urgent', status: 'In Progress' } }),
    db.consultation.create({ data: { consultCode: 'C-1041', patientId: p419.id, doctorId: admin.id, doctorName: 'Dr. T. Adebayo', dept: 'Antenatal', complaint: 'Routine ANC', diagnosis: '32-week ANC Review', notes: 'All vitals normal. Next visit in 2 weeks.', priority: 'Normal', status: 'In Progress' } }),
    db.consultation.create({ data: { consultCode: 'C-1040', patientId: p417.id, doctorId: admin.id, doctorName: 'Dr. E. Cole', dept: 'General OPD', complaint: 'Fever', diagnosis: 'Malaria (Uncomplicated)', notes: 'Prescribed ACT.', priority: 'Normal', status: 'Completed' } }),
  ]);

  // Lab Requests
  await db.$transaction([
    db.labRequest.create({ data: { labCode: 'LR-2241', patientId: p421.id, requestedById: admin.id, requestedByName: 'Dr. Amaka Obi', test: 'Full Blood Count', dept: 'Haematology', priority: 'Urgent', status: 'In Progress' } }),
    db.labRequest.create({ data: { labCode: 'LR-2240', patientId: p420.id, requestedById: admin.id, requestedByName: 'Dr. A. Peters', test: 'Electrolytes & Urea', dept: 'Biochemistry', priority: 'Urgent', status: 'Pending' } }),
    db.labRequest.create({ data: { labCode: 'LR-2239', patientId: p416.id, requestedById: admin.id, requestedByName: 'Dr. Amaka Obi', test: 'Lipid Profile', dept: 'Biochemistry', priority: 'Routine', status: 'Completed', result: 'Total Cholesterol: 5.8 mmol/L. LDL: 3.9. HDL: 1.2.' } }),
  ]);

  // Prescriptions
  await db.$transaction([
    db.prescription.create({ data: { rxCode: 'RX-8821', patientId: p421.id, prescribedById: admin.id, doctorName: 'Dr. Amaka Obi', drugs: 'Amlodipine 5mg x28, Lisinopril 10mg x28', notes: 'Take once daily with food.', status: 'Dispensed' } }),
    db.prescription.create({ data: { rxCode: 'RX-8820', patientId: p420.id, prescribedById: admin.id, doctorName: 'Dr. A. Peters', drugs: 'Methyldopa 250mg x56, Nifedipine 20mg x28', notes: 'BP monitoring required.', status: 'Pending' } }),
  ]);

  // Invoices
  await db.$transaction([
    db.invoice.create({ data: { invCode: 'INV-3301', patientId: p421.id, services: 'Consultation + Lab', amount: 18500, hmo: 'NHIS', status: 'Paid', paid: 18500 } }),
    db.invoice.create({ data: { invCode: 'INV-3300', patientId: p420.id, services: 'Emergency + Drugs', amount: 42000, hmo: 'AXA Mansard', status: 'Pending', paid: 0 } }),
    db.invoice.create({ data: { invCode: 'INV-3299', patientId: p418.id, services: 'Surgery + Ward (3 days)', amount: 185000, hmo: 'Self Pay', status: 'Part-Paid', paid: 80000 } }),
  ]);

  // Admissions
  await db.$transaction([
    db.admission.create({ data: { admCode: 'ADM-551', patientId: p420.id, ward: 'ICU', bed: 'ICU-03', doctorName: 'Dr. A. Peters', diagnosis: 'Hypertensive Crisis' } }),
    db.admission.create({ data: { admCode: 'ADM-550', patientId: p418.id, ward: 'Surgical Ward', bed: 'SW-07', doctorName: 'Dr. K. Bello', diagnosis: 'Post-op Appendectomy' } }),
  ]);

  return Response.json({
    success: true,
    seeded: { users: 2, patients: patients.length, consultations: 3, labRequests: 3, prescriptions: 2, invoices: 3, admissions: 2 },
  });
}
