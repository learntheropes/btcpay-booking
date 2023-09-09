import { defaultLocale, locales } from '~/assets/js/locales';

// Endpoint to generate dynamic routes sitemap
export default defineEventHandler(async () => {

  const serviceFiles = await useStorage(`content:${defaultLocale}:services`).getKeys();
  const endpoints = serviceFiles.map(service => (service.split('.').length === 3) ? `${service.split('.')[1]}` : `${service.split('.')[0]}`);

  const getAlternatives = (endpoint) => [{
    hreflang: 'x-default',
    href: `/${defaultLocale}/${endpoint}`
  }]
  .concat(locales
    .map(locale => {

      return {
        hreflang: locale.iso,
        href: `/${locale.code}/${endpoint}`
      }
    })
  );

  return endpoints.reduce((arr, endpoint) => {

    for (const locale of locales) {

      const alternatives = getAlternatives(endpoint)

      arr.push({
        loc: `/${locale.code}/${endpoint}`,
        alternatives,
      })
    }

    return arr;

  }, []);
})