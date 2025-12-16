import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { seoConfig, generateHrefLangUrls, getCanonicalUrl } from '@/config/seoConfig';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    type?: 'website' | 'article' | 'product';
    structuredData?: object | object[];
    path?: string;
    noindex?: boolean;
}

export default function SEO({
    title,
    description,
    keywords,
    image = seoConfig.defaultImage,
    type = 'website',
    structuredData,
    path = '/',
    noindex = false,
}: SEOProps) {
    const { i18n } = useTranslation();
    const currentLang = i18n.language;

    // Generate full title
    const fullTitle = title || seoConfig.siteName;

    // Ensure image is a full URL
    const fullImage = image.startsWith('http') ? image : `${seoConfig.siteUrl}${image}`;

    // Generate canonical URL
    const canonicalUrl = getCanonicalUrl(path);

    // Generate hreflang URLs
    const hrefLangUrls = generateHrefLangUrls(path, currentLang);

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <html lang={currentLang} />
            <title>{fullTitle}</title>
            {description && <meta name="description" content={description} />}
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Canonical URL */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Language Alternates */}
            {hrefLangUrls.map((hrefLang) => (
                <link
                    key={hrefLang.hreflang}
                    rel={hrefLang.rel}
                    hrefLang={hrefLang.hreflang}
                    href={hrefLang.href}
                />
            ))}
            <link rel="alternate" hrefLang="x-default" href={`${seoConfig.siteUrl}${path}`} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            {description && <meta property="og:description" content={description} />}
            <meta property="og:image" content={fullImage} />
            <meta property="og:site_name" content={seoConfig.siteName} />
            <meta property="og:locale" content={currentLang} />

            {/* Alternate locales */}
            {seoConfig.languages
                .filter(lang => lang !== currentLang)
                .map(lang => (
                    <meta key={`og-locale-${lang}`} property="og:locale:alternate" content={lang} />
                ))}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={fullTitle} />
            {description && <meta name="twitter:description" content={description} />}
            <meta name="twitter:image" content={fullImage} />
            {seoConfig.twitterHandle && (
                <meta name="twitter:site" content={seoConfig.twitterHandle} />
            )}

            {/* Robots */}
            {noindex && <meta name="robots" content="noindex,nofollow" />}

            {/* Structured Data (JSON-LD) */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(
                        Array.isArray(structuredData) ? structuredData : [structuredData]
                    )}
                </script>
            )}
        </Helmet>
    );
}
