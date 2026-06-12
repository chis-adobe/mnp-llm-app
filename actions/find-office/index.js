// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
const MOCK_DATA = [
    {
        name: 'Calgary (Downtown)',
        address: '2000, 112 - 4th Avenue SW, Calgary, AB T2P 0H3',
        phone: '403-263-3385'
    },
    {
        name: 'Abbotsford',
        address: '600 - 32988 South Fraser Way, Abbotsford, BC V2S 2A8',
        phone: '604-853-9471'
    }
]

module.exports = async ({ city = '', province = '' }) => {
    const normalizedCity = city.trim().toLowerCase()
    const normalizedProvince = province.trim().toUpperCase()

    const results = MOCK_DATA.filter(office => {
        if (normalizedCity && !office.address.toLowerCase().includes(normalizedCity)) {
            return false
        }
        if (normalizedProvince && !office.address.includes(normalizedProvince)) {
            return false
        }
        return true
    })

    const contentText = results.length > 0
        ? `Found ${results.length} MNP office${results.length === 1 ? '' : 's'}${normalizedCity ? ` near ${city}` : ''}${normalizedProvince ? ` in ${normalizedProvince}` : ''}.`
        : `No MNP offices found${normalizedCity ? ` near ${city}` : ''}${normalizedProvince ? ` in ${normalizedProvince}` : ''}.`

    return {
        content: [
            { type: 'text', text: contentText }
        ],
        // structuredContent.offices — bare array outputSchema; key derived from actionName "find_office"
        structuredContent: { offices: results }
    }
}

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/offices?city=${city}&province=${province}
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the MNP website API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Authentication: check the MNP website's developer docs or network requests
 *   captured during browsing for the correct auth header pattern.
 *
 * Example fetch:
 *   const params = new URLSearchParams()
 *   if (city) params.append('city', city)
 *   if (province) params.append('province', province)
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/offices?${params}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
