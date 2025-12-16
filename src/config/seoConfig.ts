export const seoConfig = {
    // Base site information
    siteName: 'DevotionSim',
    siteUrl: 'https://devotionsim.com', // Update with actual production URL
    defaultImage: '/og-image.png', // Default Open Graph image
    twitterHandle: '@DevotionSim',
    facebookAppId: '', // Optional: Add if you have a Facebook App ID

    // Social media URLs
    social: {
        instagram: 'https://www.instagram.com/devotionsim',
        youtube: 'https://www.youtube.com/@DevotionSim',
        facebook: 'https://www.facebook.com/devotionsim',
        twitter: 'https://twitter.com/devotionsim',
    },

    // Organization structured data
    organization: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'DevotionSim',
        url: 'https://devotionsim.com',
        logo: 'https://devotionsim.com/logo.png',
        description: 'Premium motorcycle simulators for professional training, entertainment, and events. Official MotoGP simulator manufacturer.',
        sameAs: [
            'https://www.instagram.com/devotionsim',
            'https://www.youtube.com/@DevotionSim',
            'https://www.facebook.com/devotionsim',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Sales',
            availableLanguage: ['en', 'es', 'ca', 'it', 'fr', 'de', 'pt', 'nl'],
        },
    },

    // Product schema templates
    products: {
        timeAttack: {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'DevotionSim Time Attack',
            description: '2-axis motorcycle simulator with lean angles up to 54° and wheelie control',
            brand: {
                '@type': 'Brand',
                name: 'DevotionSim',
            },
            category: 'Motorcycle Simulator',
            offers: {
                '@type': 'Offer',
                availability: 'https://schema.org/InStock',
                priceValidUntil: '2025-12-31',
            },
        },
        slady: {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'DevotionSim Slady',
            description: '3-axis motorcycle simulator with lean, wheelie, and rear wheel drift control',
            brand: {
                '@type': 'Brand',
                name: 'DevotionSim',
            },
            category: 'Motorcycle Simulator',
            offers: {
                '@type': 'Offer',
                availability: 'https://schema.org/InStock',
                priceValidUntil: '2025-12-31',
            },
        },
        topGun: {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'DevotionSim Top Gun',
            description: '4-axis motorcycle simulator with complete motion system including acceleration/braking',
            brand: {
                '@type': 'Brand',
                name: 'DevotionSim',
            },
            category: 'Motorcycle Simulator',
            offers: {
                '@type': 'Offer',
                availability: 'https://schema.org/InStock',
                priceValidUntil: '2025-12-31',
            },
        },
    },

    // Supported languages for hreflang
    languages: ['en', 'es', 'ca', 'it', 'fr', 'de', 'pt', 'nl'],

    // Default language
    defaultLanguage: 'en',
};

// Helper function to generate hreflang URLs
export const generateHrefLangUrls = (path: string, currentLang: string) => {
    return seoConfig.languages.map(lang => ({
        rel: 'alternate',
        hreflang: lang,
        href: `${seoConfig.siteUrl}${path}?lang=${lang}`,
    }));
};

// Helper function to get canonical URL
export const getCanonicalUrl = (path: string) => {
    return `${seoConfig.siteUrl}${path}`;
};
