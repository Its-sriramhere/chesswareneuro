import { indianTime, istInfo, istDate, shiftDate } from '../src/lib/istTime'

const cases: Array<[string, string, string]> = [
  ['UTC\u221205:00 (USA \u2014 Eastern)', '05:00 PM', '03:30 AM (IST) next day'],
  ['UTC\u221205:00 (USA \u2014 Eastern)', '09:00 AM', '07:30 PM (IST)'],
  ['UTC\u221206:00 (USA \u2014 Central)', '06:00 PM', '05:30 AM (IST) next day'],
  ['UTC\u221207:00 (USA \u2014 Mountain)', '10:00 PM', '10:30 AM (IST) next day'],
  ['UTC\u221208:00 (USA \u2014 Pacific)', '10:00 AM', '11:30 PM (IST)'],
  ['UTC+00:00 (London)', '12:00 AM', '05:30 AM (IST)'],
  ['UTC+00:00 (London)', '12:00 PM', '05:30 PM (IST)'],
  ['UTC+00:00 (London)', '10:00 AM', '03:30 PM (IST)'],
  ['UTC+04:00 (Gulf)', '07:00 PM', '08:30 PM (IST)'],
  ['UTC+08:00 (Singapore)', '09:00 PM', '06:30 PM (IST)'],
  ['UTC+10:00 (Sydney)', '12:00 AM', '07:30 PM (IST) previous day'],
  ['UTC+10:00 (Sydney)', '12:30 AM', '08:00 PM (IST) previous day'],
]

let fail = 0
for (const [tz, time, expected] of cases) {
  const got = indianTime(tz, time)
  const ok = got === expected
  if (!ok) fail++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${tz.padEnd(26)} ${time.padEnd(9)} -> ${got.padEnd(28)} (expected: ${expected})`)
}

if (fail > 0) {
  console.error(`\n${fail} IST conversion check(s) FAILED`)
  process.exit(1)
}
console.log(`\nAll ${cases.length} IST conversion checks passed.`)

const infos: Array<[string, string, string, number]> = [
  ['UTC\u221205:00 (USA \u2014 Eastern)', '05:00 PM', '03:30 AM', 1],
  ['UTC+00:00 (London)', '10:00 AM', '03:30 PM', 0],
  ['UTC+10:00 (Sydney)', '12:30 AM', '08:00 PM', -1],
]
for (const [tz, time, expectTime, expectShift] of infos) {
  const { time: t, dayShift } = istInfo(tz, time)
  if (t !== expectTime || dayShift !== expectShift) {
    console.error(`FAIL istInfo(${tz}, ${time}) -> ${t} shift ${dayShift} (expected ${expectTime}, ${expectShift})`)
    process.exit(1)
  }
}
console.log(`All ${infos.length} istInfo checks passed.`)

if (shiftDate('Fri 12 Sep 2026', 1) !== 'Sun 13 Sep 2026') {
  console.error(`FAIL shiftDate +1: ${shiftDate('Fri 12 Sep 2026', 1)}`)
  process.exit(1)
}
if (shiftDate('Fri 12 Sep 2026', -1) !== 'Fri 11 Sep 2026') {
  console.error(`FAIL shiftDate -1: ${shiftDate('Fri 12 Sep 2026', -1)}`)
  process.exit(1)
}
if (istDate('Fri 12 Sep 2026', 'UTC\u221205:00 (USA \u2014 Eastern)', '05:00 PM') !== 'Sun 13 Sep 2026') {
  console.error('FAIL istDate eastern +1 day')
  process.exit(1)
}
if (istDate('Fri 12 Sep 2026', 'UTC+10:00 (Sydney)', '12:30 AM') !== 'Fri 11 Sep 2026') {
  console.error('FAIL istDate sydney -1 day')
  process.exit(1)
}
console.log('All IST date checks passed.')