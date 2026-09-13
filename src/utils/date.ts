export function formatDateBR(isoDate: string): string {
    const [yyyy, mm, dd] = isoDate.split("T")[0].split("-")
    return `${dd}/${mm}/${yyyy}`
}

export function parseDateBR(dateBR: string): string {
    const [dd, mm, yyyy] = dateBR.split("/")
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`
}

export function isValidDateBR(dateBR: string): boolean {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateBR)
    if (!match) return false

    const dd = Number(match[1])
    const mm = Number(match[2])
    const yyyy = Number(match[3])
    if (mm < 1 || mm > 12) return false

    const daysInMonth = new Date(yyyy, mm, 0).getDate()
    return dd >= 1 && dd <= daysInMonth
}

export function getAgeInYears(birthDate?: string): number | null {
    if (!birthDate) return null

    const [yyyy, mm, dd] = birthDate.split("T")[0].split("-").map(Number)
    if (!yyyy || !mm || !dd) return null

    const hoje = new Date()
    let anos = hoje.getFullYear() - yyyy

    const jaFezAniversario =
        hoje.getMonth() + 1 > mm || (hoje.getMonth() + 1 === mm && hoje.getDate() >= dd)
    if (!jaFezAniversario) anos--

    return anos < 0 ? null : anos
}

export function formatAge(birthDate?: string): string | null {
    const anos = getAgeInYears(birthDate)
    if (anos == null) return null
    if (anos === 0) return "menos de 1 ano"
    return anos === 1 ? "1 ano" : `${anos} anos`
}
