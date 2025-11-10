'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Schedule {
  id: string
  patientName: string
  date: string
  scanTime: string
  isotope: string
  status: 'Confirmed' | 'Pending Auth' | 'Scheduled' | 'Canceled'
  insurance: string
}

export interface Vendor {
  id: string
  name: string
  paymentTerms: string
  availableIsotopes: string[]
  deliveryWindow: string
  pricing: { [key: string]: number }
}

export interface Insurance {
  id: string
  name: string
  reimbursementPercentage: number
  contactEmail: string
  contactPhone: string
}

export interface DoseCredit {
  id: string
  submittedDate: string
  receivedDate: string
  isotopeName: string
  patientName: string
  scheduleDate: string
  reasonForCredit: string
  patientId: string
}

interface DoseOrderingContextType {
  schedules: Schedule[]
  setSchedules: (schedules: Schedule[]) => void
  vendors: Vendor[]
  setVendors: (vendors: Vendor[]) => void
  insurances: Insurance[]
  setInsurances: (insurances: Insurance[]) => void
  doseCredits: DoseCredit[]
  setDoseCredits: (credits: DoseCredit[]) => void
}

const DoseOrderingContext = createContext<DoseOrderingContextType | undefined>(undefined)

export function DoseOrderingProvider({ children }: { children: ReactNode }) {
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: 'SCH001', patientName: 'John Doe', date: '2025-11-10', scanTime: '09:00 AM', isotope: 'F18 FDG (Fluorodeoxyglucose)', status: 'Confirmed', insurance: 'Blue Cross' },
    { id: 'SCH002', patientName: 'Jane Smith', date: '2025-11-10', scanTime: '10:30 AM', isotope: 'Ga-68 Dotatate (NetSpot)', status: 'Pending Auth', insurance: 'Aetna' },
    { id: 'SCH003', patientName: 'Robert Johnson', date: '2025-11-11', scanTime: '02:00 PM', isotope: 'F18 Florbetapir (Amyvid)', status: 'Scheduled', insurance: 'United Healthcare' },
    { id: 'SCH004', patientName: 'Emily Davis', date: '2025-11-12', scanTime: '11:00 AM', isotope: 'F18 NaF (Sodium Fluoride)', status: 'Confirmed', insurance: 'Cigna' },
    { id: 'SCH005', patientName: 'Michael Brown', date: '2025-11-12', scanTime: '01:30 PM', isotope: 'F18 FDG (Fluorodeoxyglucose)', status: 'Confirmed', insurance: 'Blue Cross' },
    { id: 'SCH006', patientName: 'Sarah Wilson', date: '2025-11-13', scanTime: '09:30 AM', isotope: 'F18 Fluciclovine (Axumin)', status: 'Confirmed', insurance: 'Humana' },
    { id: 'SCH007', patientName: 'David Martinez', date: '2025-11-13', scanTime: '03:00 PM', isotope: 'Ga-68 Dotatate (NetSpot)', status: 'Scheduled', insurance: 'Medicare' },
    { id: 'SCH008', patientName: 'Jennifer Taylor', date: '2025-11-14', scanTime: '10:00 AM', isotope: 'F18 Florbetapir (Amyvid)', status: 'Confirmed', insurance: 'Aetna' },
    { id: 'SCH009', patientName: 'Christopher Lee', date: '2025-11-14', scanTime: '02:30 PM', isotope: 'F18 FDG (Fluorodeoxyglucose)', status: 'Confirmed', insurance: 'Blue Cross' },
    { id: 'SCH010', patientName: 'Amanda White', date: '2025-11-15', scanTime: '08:30 AM', isotope: 'Rb82 Chloride (Rubidium-82)', status: 'Pending Auth', insurance: 'United Healthcare' },
    { id: 'SCH011', patientName: 'Daniel Harris', date: '2025-11-15', scanTime: '11:30 AM', isotope: 'F18 NaF (Sodium Fluoride)', status: 'Confirmed', insurance: 'Cigna' },
    { id: 'SCH012', patientName: 'Lisa Anderson', date: '2025-11-15', scanTime: '03:30 PM', isotope: 'F18 Fluciclovine (Axumin)', status: 'Confirmed', insurance: 'Humana' },
    { id: 'SCH013', patientName: 'James Thomas', date: '2025-11-16', scanTime: '09:00 AM', isotope: 'Ga-68 Dotatate (NetSpot)', status: 'Confirmed', insurance: 'Medicare' },
    { id: 'SCH014', patientName: 'Patricia Jackson', date: '2025-11-16', scanTime: '01:00 PM', isotope: 'F18 Florbetapir (Amyvid)', status: 'Scheduled', insurance: 'Blue Cross' },
    { id: 'SCH015', patientName: 'Mark Garcia', date: '2025-11-17', scanTime: '10:30 AM', isotope: 'F18 FDG (Fluorodeoxyglucose)', status: 'Confirmed', insurance: 'Aetna' },
    { id: 'SCH016', patientName: 'Nancy Rodriguez', date: '2025-11-17', scanTime: '02:00 PM', isotope: 'F18 NaF (Sodium Fluoride)', status: 'Confirmed', insurance: 'United Healthcare' },
    { id: 'SCH017', patientName: 'Steven Clark', date: '2025-11-18', scanTime: '09:30 AM', isotope: 'F18 Fluciclovine (Axumin)', status: 'Pending Auth', insurance: 'Cigna' },
    { id: 'SCH018', patientName: 'Karen Lewis', date: '2025-11-18', scanTime: '03:00 PM', isotope: 'Ga-68 Dotatate (NetSpot)', status: 'Confirmed', insurance: 'Humana' },
    { id: 'SCH019', patientName: 'Paul Walker', date: '2025-11-19', scanTime: '10:00 AM', isotope: 'F18 Florbetapir (Amyvid)', status: 'Confirmed', insurance: 'Medicare' },
    { id: 'SCH020', patientName: 'Susan Hall', date: '2025-11-19', scanTime: '01:30 PM', isotope: 'F18 FDG (Fluorodeoxyglucose)', status: 'Confirmed', insurance: 'Blue Cross' },
    { id: 'SCH021', patientName: 'Andrew Young', date: '2025-11-20', scanTime: '09:00 AM', isotope: 'Rb82 Chloride (Rubidium-82)', status: 'Scheduled', insurance: 'Aetna' },
    { id: 'SCH022', patientName: 'Jessica King', date: '2025-11-20', scanTime: '02:30 PM', isotope: 'F18 NaF (Sodium Fluoride)', status: 'Confirmed', insurance: 'United Healthcare' },
    { id: 'SCH023', patientName: 'Kevin Wright', date: '2025-11-21', scanTime: '10:30 AM', isotope: 'F18 Fluciclovine (Axumin)', status: 'Confirmed', insurance: 'Cigna' },
    { id: 'SCH024', patientName: 'Betty Lopez', date: '2025-11-21', scanTime: '03:00 PM', isotope: 'Ga-68 Dotatate (NetSpot)', status: 'Confirmed', insurance: 'Humana' },
    { id: 'SCH025', patientName: 'Brian Hill', date: '2025-11-22', scanTime: '09:30 AM', isotope: 'F18 Florbetapir (Amyvid)', status: 'Pending Auth', insurance: 'Medicare' },
    { id: 'SCH026', patientName: 'Sandra Scott', date: '2025-11-22', scanTime: '01:00 PM', isotope: 'F18 FDG (Fluorodeoxyglucose)', status: 'Confirmed', insurance: 'Blue Cross' },
    { id: 'SCH027', patientName: 'Edward Green', date: '2025-11-23', scanTime: '10:00 AM', isotope: 'F18 NaF (Sodium Fluoride)', status: 'Confirmed', insurance: 'Aetna' },
    { id: 'SCH028', patientName: 'Donna Adams', date: '2025-11-23', scanTime: '02:30 PM', isotope: 'F18 Fluciclovine (Axumin)', status: 'Confirmed', insurance: 'United Healthcare' },
    { id: 'SCH029', patientName: 'Ronald Nelson', date: '2025-11-24', scanTime: '09:00 AM', isotope: 'Ga-68 Dotatate (NetSpot)', status: 'Scheduled', insurance: 'Cigna' },
    { id: 'SCH030', patientName: 'Carol Carter', date: '2025-11-24', scanTime: '03:30 PM', isotope: 'F18 Florbetapir (Amyvid)', status: 'Confirmed', insurance: 'Humana' },
    { id: 'SCH031', patientName: 'Timothy Mitchell', date: '2025-11-25', scanTime: '10:30 AM', isotope: 'F18 FDG (Fluorodeoxyglucose)', status: 'Confirmed', insurance: 'Medicare' },
    { id: 'SCH032', patientName: 'Margaret Perez', date: '2025-11-25', scanTime: '01:00 PM', isotope: 'Rb82 Chloride (Rubidium-82)', status: 'Confirmed', insurance: 'Blue Cross' },
  ])

  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: 'V001',
      name: 'Cardinal Health',
      paymentTerms: 'Net 30',
      availableIsotopes: ['F18 FDG (Fluorodeoxyglucose)', 'F18 NaF (Sodium Fluoride)', 'F18 Florbetapir (Amyvid)'],
      deliveryWindow: '24-48 hours',
      pricing: {
        'F18 FDG (Fluorodeoxyglucose)': 500,
        'F18 NaF (Sodium Fluoride)': 450,
        'F18 Florbetapir (Amyvid)': 550,
      },
    },
    {
      id: 'V002',
      name: 'GE HealthCare',
      paymentTerms: 'Net 45',
      availableIsotopes: ['Ga-68 Dotatate (NetSpot)', 'F18 Florbetapir (Amyvid)', 'Rb82 Chloride (Rubidium-82)'],
      deliveryWindow: '48-72 hours',
      pricing: {
        'Ga-68 Dotatate (NetSpot)': 600,
        'F18 Florbetapir (Amyvid)': 550,
        'Rb82 Chloride (Rubidium-82)': 480,
      },
    },
    {
      id: 'V003',
      name: 'Curium Pharma',
      paymentTerms: 'Net 30',
      availableIsotopes: ['F18 Fluciclovine (Axumin)', 'Rb82 Chloride (Rubidium-82)', 'F18 FDG (Fluorodeoxyglucose)'],
      deliveryWindow: '24 hours',
      pricing: {
        'F18 Fluciclovine (Axumin)': 520,
        'Rb82 Chloride (Rubidium-82)': 480,
        'F18 FDG (Fluorodeoxyglucose)': 500,
      },
    },
    {
      id: 'V004',
      name: 'Jubilant Radiopharma',
      paymentTerms: 'Net 30',
      availableIsotopes: ['F18 Flurpiridaz (Flyrcado)', 'F18 Piflufolastat (Pylarify)', 'F18 FDG (Fluorodeoxyglucose)'],
      deliveryWindow: '24-48 hours',
      pricing: {
        'F18 Flurpiridaz (Flyrcado)': 580,
        'F18 Piflufolastat (Pylarify)': 560,
        'F18 FDG (Fluorodeoxyglucose)': 500,
      },
    },
    {
      id: 'V005',
      name: 'Sofie Biosciences',
      paymentTerms: 'Net 45',
      availableIsotopes: ['Cu-64 Dotatate (DetectNet)', 'F18 Flotufolasta (Posluma)', 'Ga69 Gozetotide (Illuccix)'],
      deliveryWindow: '48-72 hours',
      pricing: {
        'Cu-64 Dotatate (DetectNet)': 620,
        'F18 Flotufolasta (Posluma)': 590,
        'Ga69 Gozetotide (Illuccix)': 610,
      },
    },
    {
      id: 'V006',
      name: 'PetNet Solutions',
      paymentTerms: 'Net 60',
      availableIsotopes: ['Rb82 Chloride (Rubidium-82)', 'F18 FDG (Fluorodeoxyglucose)', 'Ga-68 Dotatate (NetSpot)'],
      deliveryWindow: '24-48 hours',
      pricing: {
        'Rb82 Chloride (Rubidium-82)': 490,
        'F18 FDG (Fluorodeoxyglucose)': 510,
        'Ga-68 Dotatate (NetSpot)': 600,
      },
    },
    {
      id: 'V007',
      name: 'NorthStar Medical Radioisotopes',
      paymentTerms: 'Net 30',
      availableIsotopes: ['Rb82 Chloride (Rubidium-82)', 'F18 NaF (Sodium Fluoride)', 'F18 FDG (Fluorodeoxyglucose)'],
      deliveryWindow: '24 hours',
      pricing: {
        'Rb82 Chloride (Rubidium-82)': 475,
        'F18 NaF (Sodium Fluoride)': 445,
        'F18 FDG (Fluorodeoxyglucose)': 495,
      },
    },
    {
      id: 'V008',
      name: 'Bayer Radiopharmaceuticals',
      paymentTerms: 'Net 60',
      availableIsotopes: ['F18 Florbetapir (Amyvid)', 'F18 Florbetaben (NeuraCeq)', 'F18 FDG (Fluorodeoxyglucose)'],
      deliveryWindow: '48-72 hours',
      pricing: {
        'F18 Florbetapir (Amyvid)': 560,
        'F18 Florbetaben (NeuraCeq)': 545,
        'F18 FDG (Fluorodeoxyglucose)': 510,
      },
    },
    {
      id: 'V009',
      name: 'Telix Pharmaceuticals',
      paymentTerms: 'Net 45',
      availableIsotopes: ['Ga69 Gozetotide (Illuccix)', 'Ga-68 Dotatate (NetSpot)', 'Cu-64 Dotatate (DetectNet)'],
      deliveryWindow: '48-72 hours',
      pricing: {
        'Ga69 Gozetotide (Illuccix)': 615,
        'Ga-68 Dotatate (NetSpot)': 605,
        'Cu-64 Dotatate (DetectNet)': 625,
      },
    },
    {
      id: 'V010',
      name: 'Lantheus Medical Imaging',
      paymentTerms: 'Net 30',
      availableIsotopes: ['F18 Fluciclovine (Axumin)', 'F18 NaF (Sodium Fluoride)', 'F18 FDG (Fluorodeoxyglucose)'],
      deliveryWindow: '24-48 hours',
      pricing: {
        'F18 Fluciclovine (Axumin)': 525,
        'F18 NaF (Sodium Fluoride)': 450,
        'F18 FDG (Fluorodeoxyglucose)': 505,
      },
    },
  ])

  const [insurances, setInsurances] = useState<Insurance[]>([
    {
      id: 'INS001',
      name: 'Blue Cross',
      reimbursementPercentage: 92,
      contactEmail: 'claims@bluecross.com',
      contactPhone: '1-800-555-0001',
    },
    {
      id: 'INS002',
      name: 'Aetna',
      reimbursementPercentage: 88,
      contactEmail: 'claims@aetna.com',
      contactPhone: '1-800-555-0002',
    },
    {
      id: 'INS003',
      name: 'United Healthcare',
      reimbursementPercentage: 85,
      contactEmail: 'claims@unitedhealthcare.com',
      contactPhone: '1-800-555-0003',
    },
    {
      id: 'INS004',
      name: 'Cigna',
      reimbursementPercentage: 90,
      contactEmail: 'claims@cigna.com',
      contactPhone: '1-800-555-0004',
    },
    {
      id: 'INS005',
      name: 'Humana',
      reimbursementPercentage: 87,
      contactEmail: 'claims@humana.com',
      contactPhone: '1-800-555-0005',
    },
    {
      id: 'INS006',
      name: 'Medicare',
      reimbursementPercentage: 80,
      contactEmail: 'claims@medicare.gov',
      contactPhone: '1-800-555-0006',
    },
    {
      id: 'INS007',
      name: 'Medicaid',
      reimbursementPercentage: 75,
      contactEmail: 'claims@medicaid.gov',
      contactPhone: '1-800-555-0007',
    },
  ])

  const [doseCredits, setDoseCredits] = useState<DoseCredit[]>([
    {
      id: 'DC001',
      submittedDate: '2025-11-08',
      receivedDate: '2025-11-09',
      isotopeName: 'F18 FDG (Fluorodeoxyglucose)',
      patientName: 'John Doe',
      scheduleDate: '2025-11-10',
      reasonForCredit: 'Dose decay - patient rescheduled',
      patientId: 'P001',
    },
    {
      id: 'DC002',
      submittedDate: '2025-11-07',
      receivedDate: '2025-11-08',
      isotopeName: 'Ga-68 Dotatate (NetSpot)',
      patientName: 'Jane Smith',
      scheduleDate: '2025-11-10',
      reasonForCredit: 'Patient no-show',
      patientId: 'P002',
    },
  ])

  return (
    <DoseOrderingContext.Provider value={{ schedules, setSchedules, vendors, setVendors, insurances, setInsurances, doseCredits, setDoseCredits }}>
      {children}
    </DoseOrderingContext.Provider>
  )
}

export function useDoseOrdering() {
  const context = useContext(DoseOrderingContext)
  if (!context) {
    throw new Error('useDoseOrdering must be used within DoseOrderingProvider')
  }
  return context
}
