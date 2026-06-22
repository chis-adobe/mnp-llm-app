const BASE = 'https://main--mnp-ak--chis-adobe.aem.live'
const ENDPOINT = `${BASE}/offices/query-index.json`
const ADDRESSES_ENDPOINT = `${BASE}/fragments/addresses/query-index.json?limit=500`

async function enrichFromFragments(offices) {
    const needsEnrich = offices.some(o => !o.city && o.addressFragment)
    if (!needsEnrich) return offices

    try {
        const res = await fetch(ADDRESSES_ENDPOINT)
        if (!res.ok) return offices
        const { data } = await res.json()
        const map = {}
        data.forEach(entry => { map[entry.path] = entry })

        offices.forEach(office => {
            if (!office.city && office.addressFragment) {
                const fragment = map[office.addressFragment]
                if (fragment) {
                    office.city = fragment.city || ''
                    office.address = fragment.address || ''
                    office.province = fragment.province || office.province || ''
                    office.postalCode = fragment.postalCode || ''
                    office.phone = fragment.phone || ''
                    office.fax = fragment.fax || ''
                }
            }
        })
    } catch {
        // non-fatal: offices without enriched city will be filtered below
    }

    return offices
}

module.exports = async ({ city = '', province = '' }) => {
    const normalizedCity = city.trim().toLowerCase()
    const normalizedProvince = province.trim().toUpperCase()

    const res = await fetch(ENDPOINT)
    if (!res.ok) throw new Error(`Failed to fetch offices: ${res.status}`)
    const { data } = await res.json()

    const enriched = await enrichFromFragments(data)

    const offices = enriched.filter(office => {
        if (!office.city && !office.address) return false
        if (normalizedCity && !(office.city || '').toLowerCase().includes(normalizedCity)) return false
        if (normalizedProvince && (office.province || '').toUpperCase() !== normalizedProvince) return false
        return true
    })

    const contentText = offices.length > 0
        ? `Found ${offices.length} MNP office${offices.length === 1 ? '' : 's'}${normalizedCity ? ` near ${city}` : ''}${normalizedProvince ? ` in ${normalizedProvince}` : ''}.`
        : `No MNP offices found${normalizedCity ? ` near ${city}` : ''}${normalizedProvince ? ` in ${normalizedProvince}` : ''}.`

    return {
        content: [{ type: 'text', text: contentText }],
        structuredContent: { offices }
    }
}
