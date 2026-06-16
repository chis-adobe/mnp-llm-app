module.exports = async (args) => {
    // ChatGPT sometimes passes args under unexpected keys — extract office name defensively
    const name = (args.office_name || args.officeName || args.office || Object.values(args).find(v => typeof v === 'string') || '').trim()
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    return {
        content: [
            { type: 'text', text: name ? `Opening contact form for the ${name} office.` : 'Opening contact form.' }
        ],
        structuredContent: { office_name: name, office_slug: slug }
    }
}
