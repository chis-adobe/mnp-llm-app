// test/actions/browse-services.test.js

const handler = require('../../actions/browse-services/index.js')

describe('browse_services handler', () => {
    test('returns content block shape on happy path', async () => {
        const out = await handler({})
        expect(out).toHaveProperty('content')
        expect(Array.isArray(out.content)).toBe(true)
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) })
    })

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler({})
        expect(typeof out.structuredContent).toBe('object')
        expect(Array.isArray(out.structuredContent)).toBe(false)
    })

    test('structuredContent.services is an array', async () => {
        const out = await handler({})
        expect(Array.isArray(out.structuredContent.services)).toBe(true)
    })

    test('"What services does MNP offer?" returns all services', async () => {
        const out = await handler({})
        expect(out.structuredContent.services.length).toBeGreaterThan(0)
        expect(out.content[0].text).toMatch(/Found \d+ service/)
    })

    test('filters by service_category when provided', async () => {
        const out = await handler({ service_category: 'Consulting' })
        const services = out.structuredContent.services
        expect(services.every(s => s.category === 'Consulting')).toBe(true)
        expect(services.length).toBe(3)
        expect(out.content[0].text).toMatch(/category "Consulting"/)
    })

    test('returns empty array for unknown category', async () => {
        const out = await handler({ service_category: 'NonexistentCategory' })
        expect(out.structuredContent.services.length).toBe(0)
        expect(out.content[0].text).toMatch(/Found 0 service/)
    })

    test('returns all services when service_category is empty string', async () => {
        const out = await handler({ service_category: '' })
        expect(out.structuredContent.services.length).toBe(5)
    })
})