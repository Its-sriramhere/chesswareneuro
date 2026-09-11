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

const minToIST = (min: number): string => {
  const wrapped = ((min % 1440) + 1440) % 1440
  const dayShift = Math.floor(min / 1440)
  let h = Math.floor(wrapped / 60)
  const m = wrapped % 60
  const mod = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  const time = `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${mod}`
  if (dayShift === 0) return `${time} (IST)`
  return `${time} (IST) ${dayShift > 0 ? 'next day' : 'previous day'}`
}

export const indianTime = (tz: string, t: string): string => {
  try {
    return minToIST(timeToMin(t) + (330 - tzOffsetMin(tz)))
  } catch {
    return '—'
  }
}