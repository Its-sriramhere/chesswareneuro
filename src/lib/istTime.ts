export const timeToMin = (t: string): number => {
  const [hm, mod] = t.split(' ')
  const [h, m] = hm.split(':').map(Number)
  const hr24 = (h % 12) + (mod === 'PM' ? 12 : 0)
  return hr24 * 60 + m
}

const tzOffsetMin = (tz: string): number => {
  const match = tz.match(/UTC([+\-−])(\d{2}):(\d{2})/)
  if (!match) return 0
  const sign = match[1] === '+' ? 1 : -1
  return sign * (Number(match[2]) * 60 + Number(match[3]))
}

const formatTime = (min: number): string => {
  let h = Math.floor(min / 60)
  const m = min % 60
  const mod = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${mod}`
}

export interface ISTInfo {
  time: string
  dayShift: number
}

export function istInfo(tz: string, t: string): ISTInfo {
  const shifted = timeToMin(t) + (330 - tzOffsetMin(tz))
  const dayShift = Math.floor(shifted / 1440)
  const wrapped = ((shifted % 1440) + 1440) % 1440
  return { time: formatTime(wrapped), dayShift }
}

export const indianTime = (tz: string, t: string): string => {
  try {
    const { time, dayShift } = istInfo(tz, t)
    if (dayShift === 0) return `${time} (IST)`
    return `${time} (IST) ${dayShift > 0 ? 'next day' : 'previous day'}`
  } catch {
    return '—'
  }
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const fmtDate = (d: Date) => `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`

const parseDate = (s: string): Date | null => {
  const monthIdx = new Map(MONTHS.map((m, i) => [m, i]))
  const m = s.match(/^\w{3,9}\s+(\d{1,2})\s+(\w{3})\s+(\d{4})$/)
  const mi = m ? monthIdx.get(m[2]) : undefined
  if (!m || mi === undefined) return null
  return new Date(Number(m[3]), mi, Number(m[1]))
}

export function shiftDate(dateStr: string, days: number): string {
  const d = parseDate(dateStr)
  if (!d) return dateStr
  d.setDate(d.getDate() + days)
  return fmtDate(d)
}

export function istDate(dateStr: string, tz: string, t: string): string {
  try {
    return shiftDate(dateStr, istInfo(tz, t).dayShift)
  } catch {
    return '—'
  }
}