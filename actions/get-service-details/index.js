const MOCK_DATA = [
    {
        name: 'Audits',
        description: 'Comprehensive and independent audit to enhance the credibility and reliability of your financial statements.',
        image_url: 'https://www.mnp.ca/-/media/images/mnp/service/assurance-and-accounting/subpages/assurance-and-accounting-subpage-cta-audits-800x450-jpg.jpg?h=450&iar=0&w=800&hash=B8A75E0360DD3F42E9B009DCEB947FCE',
        category: 'Assurance and Accounting'
    },
    {
        name: 'Bookkeeping and Cloud Accounting',
        description: 'Cloud accounting and bookkeeping solution to manage your business finances faster than ever before, wherever business takes you.',
        image_url: 'https://www.mnp.ca/-/media/images/mnp/service/ease-bookkeeping-services/main-service-page/business-owner-drinking-a-coffee-working-on-a-tablet.webp?iar=0&hash=240E64792C20057EEDA5CEBCDBF699CE',
        category: 'Cloud Services'
    },
    {
        name: 'Value Creation',
        description: 'Unlock the potential of your value streams to help your business succeed with the right decisions to realize better value.',
        image_url: 'https://www.mnp.ca/-/media/images/mnp/service/consulting/subpages/4101-25-corp-consulting-sub-pages---value-creation.webp?iar=0&hash=78264711BCEB94C22A151347BEDF7983',
        category: 'Consulting'
    },
    {
        name: 'Program Excellence',
        description: 'Keep your projects on track to deliver impactful results and realize the full benefits of transformation projects and business objectives.',
        image_url: 'https://www.mnp.ca/-/media/images/mnp/service/consulting/subpages/consulting-program-excellence-header.webp?iar=0&hash=E45F30DA5E9414EC1CE8F2CF24BDB04F',
        category: 'Consulting'
    },
    {
        name: 'Custom Research and Economic Insights',
        description: 'Find the right information, understand it, and make sound decisions that help your organization reach its goals.',
        image_url: 'https://www.mnp.ca/-/media/images/mnp/service/consulting/campaign-pages/custom-research-and-economic-insights.webp?iar=0&hash=5C94D9DC1FEDE14EA47130562B885E57',
        category: 'Consulting'
    }
];

module.exports = async ({ service_name = '' }) => {
    if (!service_name || typeof service_name !== 'string' || !service_name.trim()) {
        return {
            content: [{ type: 'text', text: 'Please provide a service_name to retrieve details for.' }],
            structuredContent: { service: null }
        };
    }

    const query = service_name.trim();
    const service = MOCK_DATA.find(s => s.name.toLowerCase() === query.toLowerCase());

    if (!service) {
        return {
            content: [{ type: 'text', text: `No service found with the name: ${service_name}` }],
            structuredContent: { service: null }
        };
    }

    const response = {
        name: service.name,
        description: service.description,
        category: service.category,
        sub_services: [],
        contact_name: '',
        contact_title: ''
    };

    return {
        content: [{ 
            type: 'text', 
            text: `Found service: ${service.name} — ${service.description} (Category: ${service.category})` 
        }],
        structuredContent: { service: response }
    };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/services/${encodeURIComponent(service_name)}
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Authentication: check the website's developer docs or network requests
 *   captured during browsing for the correct auth header pattern.
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/services/${encodeURIComponent(service_name)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */