export const seoConfig = {
    // Base site information
    siteName: 'DevotionSim',
    siteUrl: 'https://devotionsim.com',
    defaultImage: '/og-image.png',
    twitterHandle: '@DevotionSim',
    facebookAppId: '',

    // Business contact info
    phone: '+34 696268312',
    location: 'Barcelona',
    country: 'ES',

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
        description: 'Único simulador oficial de MotoGP en España. Alquiler y venta de simuladores de motos profesionales para eventos, entretenimiento y entrenamiento.',
        sameAs: [
            'https://www.instagram.com/devotionsim',
            'https://www.youtube.com/@DevotionSim',
            'https://www.facebook.com/devotionsim',
            'https://twitter.com/devotionsim',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+34 696268312',
            contactType: 'Sales',
            availableLanguage: ['es', 'en', 'ca', 'it', 'fr', 'de', 'pt', 'nl'],
            areaServed: ['ES', 'EU'],
        },
    },

    // LocalBusiness schema - CRITICAL for local SEO
    localBusiness: {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': 'https://devotionsim.com/#localbusiness',
        name: 'DevotionSim - Simulador Oficial MotoGP',
        description: 'Único simulador oficial de MotoGP en España. Alquiler y venta de simuladores de motos para eventos, ferias, entretenimiento y entrenamiento profesional.',
        url: 'https://devotionsim.com',
        telephone: '+34 696268312',
        image: 'https://devotionsim.com/og-image.png',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Barcelona',
            addressRegion: 'Cataluña',
            addressCountry: 'ES',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 41.3851,
            longitude: 2.1734,
        },
        priceRange: '€€€',
        areaServed: [
            { '@type': 'Country', name: 'Spain' },
            { '@type': 'Continent', name: 'Europe' },
        ],
        knowsLanguage: ['es', 'en', 'ca', 'it', 'fr', 'de', 'pt', 'nl'],
    },

    // Service schema for rental and sale
    service: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Motorcycle Simulator Rental and Sale',
        name: 'Alquiler y Venta de Simuladores MotoGP',
        description: 'Servicio profesional de alquiler y venta de simuladores de motos MotoGP para eventos, ferias, centros de entretenimiento y entrenamiento de pilotos.',
        provider: {
            '@type': 'Organization',
            name: 'DevotionSim',
            url: 'https://devotionsim.com',
        },
        areaServed: {
            '@type': 'Country',
            name: 'Spain',
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Simuladores DevotionSim',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Product',
                        name: 'Time Attack Simulator',
                        description: 'Simulador de 2 ejes con inclinación hasta 54° y control de wheelie',
                    },
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Product',
                        name: 'Slady Simulator',
                        description: 'Simulador de 3 ejes con inclinación, wheelie y deslizamiento trasero',
                    },
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Product',
                        name: 'Top Gun Simulator',
                        description: 'Simulador de 4 ejes con movimiento completo incluyendo aceleración/frenado',
                    },
                },
            ],
        },
    },

    // Product schema templates
    products: {
        timeAttack: {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'DevotionSim Time Attack',
            description: 'Simulador oficial MotoGP de 2 ejes con ángulos de inclinación hasta 54° y control de wheelie. Perfecto para eventos y entretenimiento.',
            brand: {
                '@type': 'Brand',
                name: 'DevotionSim',
            },
            category: 'Simulador de Motos',
            offers: {
                '@type': 'Offer',
                availability: 'https://schema.org/InStock',
                priceCurrency: 'EUR',
                priceValidUntil: '2025-12-31',
                seller: {
                    '@type': 'Organization',
                    name: 'DevotionSim',
                },
            },
        },
        slady: {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'DevotionSim Slady',
            description: 'Simulador oficial MotoGP de 3 ejes con inclinación, wheelie y control de deslizamiento de rueda trasera. Experiencia de drift auténtica.',
            brand: {
                '@type': 'Brand',
                name: 'DevotionSim',
            },
            category: 'Simulador de Motos',
            offers: {
                '@type': 'Offer',
                availability: 'https://schema.org/InStock',
                priceCurrency: 'EUR',
                priceValidUntil: '2025-12-31',
                seller: {
                    '@type': 'Organization',
                    name: 'DevotionSim',
                },
            },
        },
        topGun: {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'DevotionSim Top Gun',
            description: 'Simulador oficial MotoGP de 4 ejes con sistema de movimiento completo incluyendo respuesta a aceleración y frenado. La inmersión total.',
            brand: {
                '@type': 'Brand',
                name: 'DevotionSim',
            },
            category: 'Simulador de Motos',
            offers: {
                '@type': 'Offer',
                availability: 'https://schema.org/InStock',
                priceCurrency: 'EUR',
                priceValidUntil: '2025-12-31',
                seller: {
                    '@type': 'Organization',
                    name: 'DevotionSim',
                },
            },
        },
    },

    // Supported languages for hreflang
    languages: ['en', 'es', 'ca', 'it', 'fr', 'de', 'pt', 'nl'],

    // Default language
    defaultLanguage: 'es',
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
