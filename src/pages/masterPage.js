import wixSeo from 'wix-seo';
import wixLocationFrontend from 'wix-location-frontend';

$w.onReady(function () {
    const baseUrl = 'https://www.primeturf.co.za';
    const path = Array.isArray(wixLocationFrontend.path) 
        ? wixLocationFrontend.path.filter(Boolean) 
        : [];
    const currentUrl = wixLocationFrontend.url || baseUrl;
    const slug = path.length > 0 ? path.join('/') : '';

    // Helper: turn "artificial-grass-sandton" into "Sandton"
    const formatLocationName = (value) => {
        return value
            .replace(/^artificial-grass-/i, '')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
    };

    // 1. LocalBusiness (site-wide)
    const localBusiness = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": baseUrl + "/#organization",
        "name": "PrimeTurf",
        "description": "Premium artificial turf specialists serving Gauteng and the Western Cape. Professional installation with 6-year manufacturer warranty and 24-month workmanship guarantee.",
        "url": baseUrl,
        "telephone": "+27768048868",
        "email": "info@primeturf.co.za",
        "address": {
            "@type": "PostalAddress",
            "addressRegion": "Gauteng",
            "addressCountry": "ZA"
        },
        "areaServed": [
            { "@type": "AdministrativeArea", "name": "Gauteng" },
            { "@type": "AdministrativeArea", "name": "Western Cape" }
        ],
        "priceRange": "$$$$",
        "sameAs": [
            "https://wa.me/27768048868"
        ]
    };

    // 2. WebSite schema
    const webSite = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": baseUrl + "/#website",
        "url": baseUrl,
        "name": "PrimeTurf",
        "publisher": {
            "@id": baseUrl + "/#organization"
        }
    };

    // 3. BreadcrumbList
    const breadcrumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": baseUrl
            }
        ]
    };

    if (path.length > 0) {
        const pageName = formatLocationName(slug);
        breadcrumbs.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": pageName,
            "item": currentUrl
        });
    }

    // Start with core schemas
    const schemas = [localBusiness, webSite, breadcrumbs];

    // 4. Location / Service pages (artificial-grass-*)
    if (path.length > 0 && path[0].startsWith('artificial-grass-')) {
        const locationName = formatLocationName(path[0]);

        schemas.push({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Artificial Turf Installation",
            "name": "Artificial Grass Installation in " + locationName,
            "provider": {
                "@type": "LocalBusiness",
                "@id": baseUrl + "/#organization"
            },
            "areaServed": {
                "@type": "Place",
                "name": locationName
            },
            "description": "Premium artificial turf installation in " + locationName + ". Professional site assessment, engineered sub-base and 6-year warranty.",
            "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "priceCurrency": "ZAR"
            }
        });
    }

    // 5. Basic FAQPage schema for location pages
    if (path.length > 0 && path[0].startsWith('artificial-grass-')) {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "How much does artificial grass cost per m²?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Fully installed artificial grass typically ranges from R400 to R850 per m² depending on grade, site preparation and access. PrimeTurf provides a fixed-price quote after a free site visit."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Do you install in this area?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes. PrimeTurf services Gauteng and the Western Cape, including major suburbs and surrounding areas."
                    }
                }
            ]
        });
    }

    // Apply all structured data
    wixSeo.setStructuredData(schemas);
});