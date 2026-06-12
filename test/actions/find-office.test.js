const handler = require('../../actions/find-office/index.js')

describe('find_office handler', () => {
    test('returns content block shape on happy path', async () => {
        const out = await handler({ city: 'Calgary' })
        expect(out).toHaveProperty('content')
        expect(Array.isArray(out.content)).toBe(true)
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) })
    })

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler({ city: 'Calgary' })
        expect(typeof out.structuredContent).toBe('object')
        expect(Array.isArray(out.structuredContent)).toBe(false)
    })

    test('"Find an office near me" returns office locations', async () => {
        const out = await handler({ city: 'Calgary' })
        expect(out.structuredContent.offices.length).toBeGreaterThan(0)
        expect(out.content[0].text).toMatch(/Found.*MNP office/i)
    })

    test('filters by city', async () => {
        const out = await handler({ city: 'Calgary' })
        const offices = out.structuredContent.offices
        expect(offices.length).toBe(1)
        expect(offices[0].name).toBe('Calgary (Downtown)')
    })

    test('filters by province', async () => {
        const out = await handler({ province: 'BC' })
        const offices = out.structuredContent.offices
        expect(offices.length).toBe(1)
        expect(offices[0].name).toBe('Abbotsford')
    })

    test('filters by both city and province', async () => {
        const out = await handler({ city: 'Abbotsford', province: 'BC' })
        const offices = out.structuredContent.offices
        expect(offices.length).toBe(1)
        expect(offices[0].address).toMatch(/Abbotsford, BC/)
    })

    test('returns empty results when no match found', async () => {
        const out = await handler({ city: 'Nonexistent' })
        expect(out.structuredContent.offices.length).toBe(0)
        expect(out.content[0].text).toMatch(/No MNP offices found/i)
    })

    test('returns all offices when no filters provided', async () => {
        const out = await handler({})
        expect(out.structuredContent.offices.length).toBe(2)
        expect(out.content[0].text).toMatch(/Found 2 MNP offices/i)
    })
})
