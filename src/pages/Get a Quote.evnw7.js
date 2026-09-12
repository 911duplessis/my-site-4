import wixData from 'wix-data';

$w.onReady(function () {
    let configPromise = buildConfig();

    $w('#html2').onMessage((event) => {
        const data = event.data;
        if (data && data.type === 'PT_READY') {
            configPromise.then((config) => {
                if (config) {
                    $w('#html2').postMessage({ type: 'PT_PRICING_CONFIG', config: config });
                }
            });
        }
    });
});

function buildConfig() {
    return Promise.all([
        wixData.query('PricingSettings').find(),
        wixData.query('TurfSpecs').find(),
        wixData.query('Addons').find()
    ]).then((results) => {
        const settingsItems = results[0].items;
        const turfItems = results[1].items;
        const addonItems = results[2].items;
        if (!settingsItems.length) {
            return null;
        }
        const s = settingsItems[0];

        const turfSpecs = turfItems.map((t) => ({
            id: t.specId,
            label: t.title,
            tierGroup: t.tierGroup,
            supplyRatePerSqm: t.supplyRatePerSqm,
            installRatePerSqm: t.installRatePerSqm
        }));

        const perZone = addonItems.filter((a) => a.scope === 'perZone').map(buildAddon);
        const global = addonItems.filter((a) => a.scope === 'global').map(buildAddon);

        return {
            currency: 'ZAR',
            currencySymbol: 'R',
            vatIncluded: false,
            vatRate: s.vatRate,
            company: {
                name: 'PrimeTurf SA',
                website: 'https://www.primeturf.co.za',
                whatsapp: s.whatsapp,
                email: s.companyEmail
            },
            turfSpecs: turfSpecs,
            complexityMultipliers: {
                easy: { label: 'Easy - open, flat, regular shape', laborMultiplier: s.easyMultiplier },
                medium: { label: 'Medium - slopes, curves, obstacles', laborMultiplier: s.mediumMultiplier },
                complex: { label: 'Complex - steps, tight access, custom cuts', laborMultiplier: s.complexMultiplier }
            },
            addons: {
                perZone: perZone,
                global: global
            },
            quoteRangeBufferPct: s.quoteRangeBufferPct,
            minimumJobValue: s.minimumJobValue
        };
    }).catch((err) => {
        console.error('Failed to load pricing config from CMS', err);
        return null;
    });
}

function buildAddon(a) {
    const addon = {
        id: a.addonId,
        label: a.title,
        unit: a.unit,
        defaultOn: !!a.defaultOn
    };
    if (a.unit === 'sqm') {
        addon.ratePerSqm = a.rate;
    } else if (a.unit === 'lm') {
        addon.ratePerLm = a.rate;
    } else if (a.unit === 'flat') {
        addon.flatRate = a.rate;
    }
    return addon;
}
