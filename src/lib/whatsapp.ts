import { indianTime } from './istTime'

export const COMPANY_WHATSAPP = '917598111855'

export interface WhatsAppBookingData {
  name: string
  country?: string
  whatsapp?: string
  program: string
  coach: string
  hours: string
  date: string
  time: string
  timezone: string
  message?: string
}

export function buildWhatsAppLink(data: WhatsAppBookingData): string {
  const lines = [
    '♟️ Chessware Neuro — Booking Request',
    '',
    `Name: ${data.name}`,
    data.country ? `Country: ${data.country}` : '',
    `Program: ${data.program}`,
    `Coach: ${data.coach}`,
    `Session: ${data.hours}`,
    `Date: ${data.date}`,
    `Local time: ${data.time} (${data.timezone})`,
    `Indian Time: ${indianTime(data.timezone, data.time)}`,
    data.whatsapp ? `WhatsApp: ${data.whatsapp}` : '',
    data.message ? `Message: ${data.message}` : '',
    '',
    'Please confirm my slot. Thank you!',
  ]
    .filter((l) => l !== '')
    .join('\n')

  return `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(lines)}`
}