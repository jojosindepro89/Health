-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'front_desk',
    "hospital" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientCode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "hmo" TEXT NOT NULL DEFAULT 'Self Pay',
    "dept" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "bloodGroup" TEXT NOT NULL DEFAULT 'O+',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "consultCode" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT,
    "doctorName" TEXT NOT NULL,
    "dept" TEXT NOT NULL,
    "complaint" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "priority" TEXT NOT NULL DEFAULT 'Normal',
    "status" TEXT NOT NULL DEFAULT 'Waiting',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Consultation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Consultation_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LabRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "labCode" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "requestedById" TEXT,
    "requestedByName" TEXT NOT NULL,
    "test" TEXT NOT NULL,
    "dept" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'Routine',
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "result" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LabRequest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LabRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rxCode" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "prescribedById" TEXT,
    "doctorName" TEXT NOT NULL,
    "drugs" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Prescription_prescribedById_fkey" FOREIGN KEY ("prescribedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invCode" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "services" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "hmo" TEXT NOT NULL DEFAULT 'Self Pay',
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "paid" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Invoice_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Admission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "admCode" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "bed" TEXT NOT NULL,
    "doctorName" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "admittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dischargedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Admission_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PrintLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logCode" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "printedById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PrintLog_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PrintLog_printedById_fkey" FOREIGN KEY ("printedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_patientCode_key" ON "Patient"("patientCode");

-- CreateIndex
CREATE UNIQUE INDEX "Consultation_consultCode_key" ON "Consultation"("consultCode");

-- CreateIndex
CREATE UNIQUE INDEX "LabRequest_labCode_key" ON "LabRequest"("labCode");

-- CreateIndex
CREATE UNIQUE INDEX "Prescription_rxCode_key" ON "Prescription"("rxCode");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invCode_key" ON "Invoice"("invCode");

-- CreateIndex
CREATE UNIQUE INDEX "Admission_admCode_key" ON "Admission"("admCode");

-- CreateIndex
CREATE UNIQUE INDEX "PrintLog_logCode_key" ON "PrintLog"("logCode");
