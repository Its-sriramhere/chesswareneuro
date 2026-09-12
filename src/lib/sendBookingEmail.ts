import { indianTime, istInfo, istDate, shiftDate } from './istTime'

export interface BookingEmailData {
  program: string
  programPrice?: string
  coach: string
  timezone: string
  hours: string
  date: string
  time: string
  name: string
  email: string
  whatsapp?: string
  country?: string
  message?: string
}

const ENDPOINT = 'https://formsubmit.co/ajax/chesswareneuropvtltd@gmail.com'

const istFields = (data: BookingEmailData) => {
  try {
    const { time, dayShift } = istInfo(data.timezone, data.time)
    return {
      timeLabel:
        dayShift === 0 ? `${time} (IST)` : `${time} (IST) ${dayShift > 0 ? 'next day' : 'previous day'}`,
      date: istDate(data.date, data.timezone, data.time),
      shiftLabel: dayShift > 0 ? `Add +${dayShift} day` : dayShift < 0 ? `${dayShift} day` : '—',
    }
  } catch {
    return { timeLabel: '—', date: '—', shiftLabel: '—' }
  }
}

export async function sendBookingEmail(data: BookingEmailData): Promise<void> {
  const ist = istFields(data)

  const payload = {
    _subject: `♟ New Chessware Neuro Booking — ${data.name}`,
    _template: 'card',
    _captcha: 'false',
    'Student Name': data.name,
    'Email': data.email,
    'WhatsApp': data.whatsapp || '—',
    'Country': data.country || '—',
    'Program': data.program,
    'Coach': data.coach,
    'Session Length': data.hours,
    'Scheduled Date (Customer Zone)': data.date,
    'Scheduled Time (Customer Zone)': data.time,
    'Customer Time Zone': data.timezone,
    'IST Day Offset': ist.shiftLabel,
    'Scheduled Date (India — IST)': ist.date,
    'Scheduled Time (India — IST)': ist.timeLabel,
    'Message': data.message || '—',
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Booking send failed (${res.status}): ${text}`)
  }
}