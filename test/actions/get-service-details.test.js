const handler = require('../../actions/get-service-details/index.js');

describe('get_service_details handler', () => {
    test('"Tell me more about Audits" returns service details', async () => {
        const out = await handler({ service_name: 'Audits' });
        expect(out).toHaveProperty('content');
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
        expect(out.content[0].text).toMatch(/Audits/i);
    });

    test('returns content block shape on happy path', async () => {
        const out = await handler({ service_name: 'Value Creation' });
        expect(out).toHaveProperty('content');
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
    });

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler({ service_name: 'Audits' });
        expect(typeof out.structuredContent).toBe('object');
        expect(Array.isArray(out.structuredContent)).toBe(false);
    });

    test('structuredContent.service contains the correct fields', async () => {
        const out = await handler({ service_name: 'Audits' });
        expect(out.structuredContent.service).toMatchObject({
            name: expect.any(String),
            description: expect.any(String),
            category: expect.any(String),
            sub_services: expect.any(Array),
            contact_name: expect.any(String),
            contact_title: expect.any(String)
        });
    });

    test('returns error message when required arg is missing', async () => {
        const out = await handler({});
        expect(out.content[0].text).toMatch(/service_name|provide/i);
    });

    test('returns error message when service_name is empty string', async () => {
        const out = await handler({ service_name: '' });
        expect(out.content[0].text).toMatch(/provide/i);
        expect(out.structuredContent.service).toBeNull();
    });

    test('returns null service when service name is not found', async () => {
        const out = await handler({ service_name: 'Nonexistent Service' });
        expect(out.content[0].text).toMatch(/No service found/i);
        expect(out.structuredContent.service).toBeNull();
    });

    test('case-insensitive service name matching', async () => {
        const out = await handler({ service_name: 'audits' });
        expect(out.structuredContent.service).not.toBeNull();
        expect(out.structuredContent.service.name).toBe('Audits');
    });
});