-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "scanType" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "insurance" TEXT NOT NULL,
    "appointmentStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "insuranceReimbursement" DECIMAL(10,2) NOT NULL,
    "vendorOrderWindow" TEXT NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "paymentTerms" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoseOrder" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "doseType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoseCredit" (
    "id" TEXT NOT NULL,
    "doseOrderId" TEXT NOT NULL,
    "cancellationId" TEXT,
    "creditAmount" DECIMAL(10,2) NOT NULL,
    "creditDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoseCredit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cancellation" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "cancellationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cancellation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyAreaSurvey" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "technologist" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "doseRate" DECIMAL(10,4) NOT NULL,
    "doseRateUnit" TEXT NOT NULL,
    "actions" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyAreaSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyAreaSurvey" (
    "id" TEXT NOT NULL,
    "weekEnding" TIMESTAMP(3) NOT NULL,
    "technologist" TEXT NOT NULL,
    "areas" TEXT NOT NULL,
    "maxReading" DECIMAL(10,4) NOT NULL,
    "avgReading" DECIMAL(10,4) NOT NULL,
    "comments" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyAreaSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SealedSourceInventory" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "sourceId" TEXT NOT NULL,
    "isotope" TEXT NOT NULL,
    "activity" DECIMAL(10,4) NOT NULL,
    "location" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SealedSourceInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TracerCheckInOut" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "tracerType" TEXT NOT NULL,
    "technologist" TEXT NOT NULL,
    "checkInTime" TIMESTAMP(3),
    "checkOutTime" TIMESTAMP(3),
    "patientId" TEXT,
    "action" TEXT NOT NULL,
    "vendorName" TEXT,
    "barcodeScanned" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TracerCheckInOut_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientDoseInfo" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "doseName" TEXT NOT NULL,
    "preInjectionTime" TIMESTAMP(3),
    "injectionTime" TIMESTAMP(3),
    "postInjectionTime" TIMESTAMP(3),
    "doseOrdered" DECIMAL(10,4) NOT NULL,
    "doseDelivered" DECIMAL(10,4) NOT NULL,
    "scanDate" TIMESTAMP(3) NOT NULL,
    "cancellation" BOOLEAN NOT NULL DEFAULT false,
    "creditDue" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientDoseInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QCOnInstrument" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "technologist" TEXT NOT NULL,
    "vialMciAmount" DECIMAL(10,4),
    "qcTest" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "comments" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QCOnInstrument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DosimeterTracker" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "employee" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "exposure" DECIMAL(10,4) NOT NULL,
    "monthlyTotal" DECIMAL(10,4) NOT NULL,
    "quarterlyTotal" DECIMAL(10,4) NOT NULL,
    "yearlyTotal" DECIMAL(10,4) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DosimeterTracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteManagement" (
    "id" TEXT NOT NULL,
    "binName" TEXT NOT NULL,
    "binNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WasteManagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionItem" (
    "id" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_patientId_key" ON "Patient"("patientId");

-- CreateIndex
CREATE INDEX "Patient_appointmentStatus_idx" ON "Patient"("appointmentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_name_key" ON "Vendor"("name");

-- CreateIndex
CREATE INDEX "DoseOrder_patientId_idx" ON "DoseOrder"("patientId");

-- CreateIndex
CREATE INDEX "DoseOrder_vendorId_idx" ON "DoseOrder"("vendorId");

-- CreateIndex
CREATE INDEX "DoseOrder_status_idx" ON "DoseOrder"("status");

-- CreateIndex
CREATE INDEX "DoseCredit_doseOrderId_idx" ON "DoseCredit"("doseOrderId");

-- CreateIndex
CREATE INDEX "DailyAreaSurvey_date_idx" ON "DailyAreaSurvey"("date");

-- CreateIndex
CREATE INDEX "DailyAreaSurvey_status_idx" ON "DailyAreaSurvey"("status");

-- CreateIndex
CREATE INDEX "WeeklyAreaSurvey_weekEnding_idx" ON "WeeklyAreaSurvey"("weekEnding");

-- CreateIndex
CREATE INDEX "WeeklyAreaSurvey_status_idx" ON "WeeklyAreaSurvey"("status");

-- CreateIndex
CREATE INDEX "SealedSourceInventory_date_idx" ON "SealedSourceInventory"("date");

-- CreateIndex
CREATE INDEX "SealedSourceInventory_sourceId_idx" ON "SealedSourceInventory"("sourceId");

-- CreateIndex
CREATE INDEX "TracerCheckInOut_date_idx" ON "TracerCheckInOut"("date");

-- CreateIndex
CREATE INDEX "TracerCheckInOut_tracerType_idx" ON "TracerCheckInOut"("tracerType");

-- CreateIndex
CREATE UNIQUE INDEX "PatientDoseInfo_patientId_key" ON "PatientDoseInfo"("patientId");

-- CreateIndex
CREATE INDEX "PatientDoseInfo_scanDate_idx" ON "PatientDoseInfo"("scanDate");

-- CreateIndex
CREATE INDEX "QCOnInstrument_date_idx" ON "QCOnInstrument"("date");

-- CreateIndex
CREATE INDEX "QCOnInstrument_instrumentId_idx" ON "QCOnInstrument"("instrumentId");

-- CreateIndex
CREATE INDEX "DosimeterTracker_date_idx" ON "DosimeterTracker"("date");

-- CreateIndex
CREATE INDEX "DosimeterTracker_badgeId_idx" ON "DosimeterTracker"("badgeId");

-- CreateIndex
CREATE INDEX "DosimeterTracker_status_idx" ON "DosimeterTracker"("status");

-- CreateIndex
CREATE UNIQUE INDEX "WasteManagement_binNumber_key" ON "WasteManagement"("binNumber");

-- CreateIndex
CREATE INDEX "ActionItem_dueDate_idx" ON "ActionItem"("dueDate");

-- CreateIndex
CREATE INDEX "ActionItem_completed_idx" ON "ActionItem"("completed");

-- AddForeignKey
ALTER TABLE "DoseOrder" ADD CONSTRAINT "DoseOrder_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoseOrder" ADD CONSTRAINT "DoseOrder_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoseCredit" ADD CONSTRAINT "DoseCredit_doseOrderId_fkey" FOREIGN KEY ("doseOrderId") REFERENCES "DoseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoseCredit" ADD CONSTRAINT "DoseCredit_cancellationId_fkey" FOREIGN KEY ("cancellationId") REFERENCES "Cancellation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientDoseInfo" ADD CONSTRAINT "PatientDoseInfo_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
