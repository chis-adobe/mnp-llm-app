module.exports = async ({ office_name = '' }) => {
    const name = office_name.trim()
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    return {
        content: [
            { type: 'text', text: name ? `Opening contact form for ${name}.` : 'Opening contact form.' }
        ],
        structuredContent: { office_name: name, office_slug: slug }
    }
}
