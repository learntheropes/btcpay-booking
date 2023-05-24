import { locales } from '~/assets/js/locales';
import countryCodes from '~/assets/js/country-codes';
import countries from 'i18n-iso-countries';
import sortBy from 'lodash.sortby';

export default defineNuxtPlugin(async nuxtApp => {

  // Import all the required languages
  for (const locale of locales) {
    countries.registerLocale(await import(`../node_modules/i18n-iso-countries/langs/${locale.code}.json`));
  };

  // Get buyer locale
  const { locale: { value: locale }} = nuxtApp.$i18n;

  return {
    provide: {
      getCountriesList: () => {
        return sortBy(countryCodes.map(country => {
          return {
            code: country.code,
            name: countries.getName(country.code, locale, {
              select: "official"
            })
          };
        }), ['name']);
      },
      getOneCountry: (countryCode) => {
        return countries.getName(countryCode, locale, {
          select: "official"
        });
      }
    }
  };
});