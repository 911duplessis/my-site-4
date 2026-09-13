import wixSeo from 'wix-seo';
import wixLocationFrontend from 'wix-location-frontend';

$w.onReady(function () {
    const baseUrl = 'https://www.primeturf.co.za';
    const path = Array.isArray(wixLocationFrontend.path) ? wixLocationFrontend.path.filter(Boolean) : [];
    const currentUrl = wixLocationFrontend.url || baseUrl;

    const formatPageName = function (value) {
        return value
            .replace(/artificial-grass-/i, '')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    };

    const localBusiness = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": baseUrl + "/#organization",
        "name": "PrimeTurf",
        "description": "Luxury artificial turf specialists serving Gauteng and the Western Cape. Premium installation with 6-year warranty.",
        "url": baseUrl,
        "telephone": "+27768048868",
        "email": "leon@primeturf.co.za",
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
        const slug = path.join('/');
        const pageName = formatPageName(slug);

        breadcrumbs.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": pageName,
            "item": currentUrl || (baseUrl + '/' + slug)
        });
    }

    const schemas = [localBusiness, breadcrumbs];

    if (path.length > 0 && path[0].startsWith('artificial-grass-')) {
        const locationName = formatPageName(path[0].replace('artificial-grass-', ''));

        schemas.push({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Artificial Turf Installation",
            "provider": {
                "@type": "LocalBusiness",
                "@id": baseUrl + "/#organization"
            },
            "areaServed": {
                "@type": "Place",
                "name": locationName
            },
            "description": "Premium artificial turf installation in " + locationName + ". Professional fitting with 6-year warranty.",
            "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "priceSpecification": {
                    "@type": "PriceSpecification",
                    "priceCurrency": "ZAR"
                }
            }
        });
    }

    wixSeo.setStructuredData(schemas);
});
