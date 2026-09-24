/** Today as YYYY-MM-DD in local timezone (API / comparisons). */
export function todayLocalDate(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Today as DD/MM/AAAA for display/input. */
export function todayBrDate(): string {
  return isoDateToBr(todayLocalDate())
}

const BR_DATE = /^(\d{2})\/(\d{2})\/(\d{4})$/

/** Valid calendar date as DD/MM/AAAA (rejects 31/02/2026 etc.). */
export function isValidBrDate(value: string): boolean {
  const m = BR_DATE.exec(value.trim())
  if (!m) return false
  const day = Number(m[1])
  const month = Number(m[2])
  const year = Number(m[3])
  const dt = new Date(year, month - 1, day)
  return dt.getFullYear() === year && dt.getMonth() === month - 1 && dt.getDate() === day
}

/** Valid calendar date as YYYY-MM-DD. */
export function isValidLocalDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [y, m, d] = value.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
}

export function isoDateToBr(iso: string): string {
  if (!isValidLocalDate(iso)) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function brDateToIso(br: string): string {
  const m = BR_DATE.exec(br.trim())
  if (!m) throw new Error('Data inválida')
  const day = m[1]
  const month = m[2]
  const year = m[3]
  const iso = `${year}-${month}-${day}`
  if (!isValidLocalDate(iso)) throw new Error('Data inválida')
  return iso
}

/** Mask digits into DD/MM/AAAA (max 8 digits). Soft-clamps day/month while typing. */
export function maskDateBr(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  if (digits.length === 0) return ''

  let dd = digits.slice(0, 2)
  let mm = digits.slice(2, 4)
  const yyyy = digits.slice(4, 8)

  if (dd.length === 1 && Number(dd) > 3) {
    dd = `0${dd}`
  }
  if (dd.length === 2) {
    const d = Number(dd)
    if (d === 0) dd = '01'
    else if (d > 31) dd = '31'
  }

  if (mm.length === 1 && Number(mm) > 1) {
    mm = `0${mm}`
  }
  if (mm.length === 2) {
    const m = Number(mm)
    if (m === 0) mm = '01'
    else if (m > 12) mm = '12'
  }

  const slashCount = (raw.match(/\//g) ?? []).length

  if (digits.length <= 2) {
    return dd.length === 2 && slashCount >= 1 ? `${dd}/` : dd
  }
  if (digits.length <= 4) {
    const base = `${dd}/${mm}`
    return mm.length === 2 && slashCount >= 2 ? `${base}/` : base
  }
  return `${dd}/${mm}/${yyyy}`
}

const TIME_24H = /^([01]\d|2[0-3]):([0-5]\d)$/

export function isValidTime24h(value: string): boolean {
  return TIME_24H.test(value.trim())
}

/** Mask digits into HH:mm (max 4 digits). Soft-validates hour/minute ranges while typing. */
export function maskTime24h(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length === 0) return ''

  let hh = digits.slice(0, 2)
  let mm = digits.slice(2)

  if (hh.length === 1 && Number(hh) > 2) {
    hh = `0${hh}`
  }
  if (hh.length === 2) {
    const h = Number(hh)
    if (h > 23) hh = '23'
  }
  if (mm.length === 1 && Number(mm) > 5) {
    mm = `0${mm}`
  }
  if (mm.length === 2) {
    const m = Number(mm)
    if (m > 59) mm = '59'
  }

  if (digits.length <= 2) {
    return hh.length === 2 && raw.includes(':') ? `${hh}:` : hh
  }
  return `${hh}:${mm}`
}

/** Combine DD/MM/AAAA + 24h time (HH:mm) into ISO string */
export function localDateAndTimeToIso(brDate: string, time: string): string {
  if (!isValidBrDate(brDate) || !isValidTime24h(time)) {
    throw new Error('Data/hora inválida')
  }
  const isoDate = brDateToIso(brDate)
  const [y, m, day] = isoDate.split('-').map(Number)
  const [hh, mm] = time.trim().split(':').map(Number)
  const local = new Date(y, m - 1, day, hh, mm, 0, 0)
  if (Number.isNaN(local.getTime())) {
    throw new Error('Data/hora inválida')
  }
  return local.toISOString()
}

export function isFutureLocalDateTime(brDate: string, time: string): boolean {
  if (!isValidBrDate(brDate) || !isValidTime24h(time)) return false
  const isoDate = brDateToIso(brDate)
  const [y, m, day] = isoDate.split('-').map(Number)
  const [hh, mm] = time.trim().split(':').map(Number)
  const local = new Date(y, m - 1, day, hh, mm, 0, 0)
  return local.getTime() > Date.now()
}

export function isFutureBrDate(brDate: string): boolean {
  if (!isValidBrDate(brDate)) return false
  return brDateToIso(brDate) > todayLocalDate()
}

export function compareBrDates(a: string, b: string): number {
  return brDateToIso(a).localeCompare(brDateToIso(b))
}
