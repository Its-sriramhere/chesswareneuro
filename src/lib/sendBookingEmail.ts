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
}

const ENDPOINT = 'https://formsubmit.co/ajax/sriram.efx@gmail.com'

export async function sendBookingEmail(data: BookingEmailData): Promise<void> {
  const payload = {
    _subject: `♟ New Chessware Neuro Booking — ${data.name}`,
    _template: 'table',
    _captcha: 'false',
    Name: data.name,
    Email: data.email,
    Program: data.program,
    Coach: data.coach,
    Session: data.hours,
    Timezone: data.timezone,
    Date: data.date,
    Time: data.time,
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