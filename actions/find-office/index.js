const ENDPOINT = 'https://main--mnp-ak--chis-adobe.aem.live/offices/query-index.json'

module.exports = async ({ city = '', province = '' }) => {
    const normalizedCity = city.trim().toLowerCase()
    const normalizedProvince = province.trim().toUpperCase()

    const res = await fetch(ENDPOINT)
    if (!res.ok) throw new Error(`Failed to fetch offices: ${res.status}`)
    const { data } = await res.json()

    const offices = data.filter(office => {
        if (!office.city && !office.address) return false
        if (normalizedCity && !office.city.toLowerCase().includes(normalizedCity)) return false
        if (normalizedProvince && office.province.toUpperCase() !== normalizedProvince) return false
        return true
    })

    const contentText = offices.length > 0
        ? `Found ${offices.length} MNP office${offices.length === 1 ? '' : 's'}${normalizedCity ? ` near ${city}` : ''}${normalizedProvince ? ` in ${normalizedProvince}` : ''}.`
        : `No MNP offices found${normalizedCity ? ` near ${city}` : ''}${normalizedProvince ? ` in ${normalizedProvince}` : ''}.`

    return {
        content: [
            { type: 'text', text: contentText }
        ],
        structuredContent: { offices }
    }
}
