const handler = require('../../actions/find-office/index.js')

const FIXTURE = [
    {
        path: '/offices/calgary',
        city: 'Calgary',
        address: '2000, 112 - 4th Avenue SW',
        province: 'AB',
        postalCode: 'T2P 0H3',
        phone: '403-263-3385',
        fax: '403-263-3386',
        addressFragment: ''
    },
    {
        path: '/offices/abbotsford',
        city: 'Abbotsford',
        address: '600 - 32988 South Fraser Way',
        province: 'BC',
        postalCode: 'V2S 2A8',
        phone: '604-853-9471',
        fax: '604-850-3672',
        addressFragment: ''
    },
    // entry with no direct data — should be excluded from results
    {
        path: '/offices/airdrie',
        city: '',
        address: '',
        province: '',
        postalCode: '',
        phone: '',
        fax: '',
        addressFragment: '/fragments/addresses/airdrie'
    }
]

function mockFetch(data) {
    return jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ data })
    })
}

afterEach(() => jest.restoreAllMocks())

describe('find_office handler', () => {
    test('returns content block shape on happy path', async () => {
        mockFetch(FIXTURE)
        const out = await handler({ city: 'Calgary' })
        expect(out).toHaveProperty('content')
        expect(Array.isArray(out.content)).toBe(true)
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) })
    })

    test('structuredContent is a plain object, not a bare array', async () => {
        mockFetch(FIXTURE)
        const out = await handler({ city: 'Calgary' })
        expect(typeof out.structuredContent).toBe('object')
        expect(Array.isArray(out.structuredContent)).toBe(false)
    })

    test('"Find an office near me" returns office locations', async () => {
        mockFetch(FIXTURE)
        const out = await handler({ city: 'Calgary' })
        expect(out.structuredContent.offices.length).toBeGreaterThan(0)
        expect(out.content[0].text).toMatch(/Found.*MNP office/i)
    })

    test('filters by city', async () => {
        mockFetch(FIXTURE)
        const out = await handler({ city: 'Calgary' })
        const offices = out.structuredContent.offices
        expect(offices.length).toBe(1)
        expect(offices[0].city).toBe('Calgary')
    })

    test('filters by province', async () => {
        mockFetch(FIXTURE)
        const out = await handler({ province: 'BC' })
        const offices = out.structuredContent.offices
        expect(offices.length).toBe(1)
        expect(offices[0].city).toBe('Abbotsford')
        expect(offices[0].province).toBe('BC')
    })

    test('filters by both city and province', async () => {
        mockFetch(FIXTURE)
        const out = await handler({ city: 'Abbotsford', province: 'BC' })
        const offices = out.structuredContent.offices
        expect(offices.length).toBe(1)
        expect(offices[0].city).toBe('Abbotsford')
        expect(offices[0].province).toBe('BC')
    })

    test('returns empty results when no match found', async () => {
        mockFetch(FIXTURE)
        const out = await handler({ city: 'Nonexistent' })
        expect(out.structuredContent.offices.length).toBe(0)
        expect(out.content[0].text).toMatch(/No MNP offices found/i)
    })

    test('returns all offices with direct data when no filters provided', async () => {
        mockFetch(FIXTURE)
        const out = await handler({})
        // FIXTURE has 3 entries; 1 has no city/address and should be excluded
        expect(out.structuredContent.offices.length).toBe(2)
        expect(out.content[0].text).toMatch(/Found 2 MNP offices/i)
    })

    test('excludes entries with no direct address data', async () => {
        mockFetch(FIXTURE)
        const out = await handler({})
        const paths = out.structuredContent.offices.map(o => o.path)
        expect(paths).not.toContain('/offices/airdrie')
    })

    test('throws on non-ok fetch response', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({ ok: false, status: 500 })
        await expect(handler({})).rejects.toThrow('Failed to fetch offices: 500')
    })
})
