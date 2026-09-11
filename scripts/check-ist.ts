import { indianTime } from '../src/lib/istTime'

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