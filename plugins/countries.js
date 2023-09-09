import { locales } from '~/assets/js/locales';
import countryCodes from '~/assets/js/country-codes';
import countries from 'i18n-iso-countries';
import sortBy from 'lodash.sortby';

// Import all the needed languages
import * as en from 'i18n-iso-countries/langs/en';
import * as es from 'i18n-iso-countries/langs/es';
import * as it from 'i18n-iso-countries/langs/it';

// Register the languages
countries.registerLocale(en);
countries.registerLocale(es);
countries.registerLocale(it);

export default defineNuxtPlugin(async nuxtApp => {

  // Get buyer locale
  const { locale } = nuxtApp.$i18n;

  return {
    provide: {
      // Function to get the full transalted list of countries sorted alphabetically
      getCountriesList: () => {
        return sortBy(countryCodes.map(country => {
          return {
            code: country.code,
            name: countries.getName(country.code, locale.value, {
              select: "official"
            })
          };
        }), ['name']);
      },
      // Function to get just one translated country given the country code
      getOneCountry: (countryCode) => {
        return countries.getName(countryCode, locale.value, {
          select: "official"
        });
      }
    }
  };
});