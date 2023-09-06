import { defineRule, configure } from "vee-validate";
import { localize } from '@vee-validate/i18n';
import { locales } from '../assets/js/locales';

// Check that the selected slots in a day is included between accepted values
const arrayLengthBetween = (value,{ min, max }) => {
  return value && value.length >= Number(min) && value.length <= Number(max);
};

// Check that the pgp hey fingerpint is on the server and the key is associated with the provided email
const checkPGPKey = async (nuxtApp, value, [target], _ctx) => {

  // Always validate if empty because we eventually already checked it with required standard rule is required by the merchant
  if (!value) return true;
  const { t } = nuxtApp.$i18n;

  // Remove the ususual empty spaces from the provided fingerprint
  const fingerprint = value.replaceAll(' ', '');

  try {
    // Try to retrive the pub key from openpgp xerver
    const { data: file } = await useFetch(`https://keys.openpgp.org/vks/v1/by-fingerprint/${fingerprint}`);
    const publicKey = await file.value.text();

    // Return the error message informing the user that the email is not associated with the fingerprint
    if (!publicKey.includes(target)) {
      return t('customRules._isAssociatedWithEmail', {
        fingerprint,
        target
      })
    }
    
    // Emit the retrived pgp key to store in form
    nuxtApp.$event('setPGP', publicKey)

    // pass validation
    return true
  } catch (error) {
    // Return the error message to inform the user that the fingerprint is not on server
    return t('customRules._isOnServer', { fingerprint })
  }
};

// Validate the IBAN
// https://stackoverflow.com/a/35599724
const validateIban = (input) => {
  var CODE_LENGTHS = {
      AD: 24, AE: 23, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
      CH: 21, CR: 21, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24,
      FI: 18, FO: 18, FR: 27, GB: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21,
      HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
      LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27,
      MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
      RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26,   
      AL: 28, BY: 28, CR: 22, EG: 29, GE: 22, IQ: 23, LC: 32, SC: 31, ST: 25,
      SV: 28, TL: 23, UA: 29, VA: 22, VG: 24, XK: 20
  };
  var iban = String(input).toUpperCase().replace(/[^A-Z0-9]/g, ''), // keep only alphanumeric characters
          code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/), // match and capture (1) the country code, (2) the check digits, and (3) the rest
          digits;
  // check syntax and length
  if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
      return false;
  }
  // rearrange country code and check digits, and convert chars to ints
  digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, function (letter) {
      return letter.charCodeAt(0) - 55;
  });
  // final check
  return mod97(digits) === 1;
}

const mod97 = (string) => {
  var checksum = string.slice(0, 2), fragment;
  for (var offset = 2; offset < string.length; offset += 7) {
      fragment = String(checksum) + string.substring(offset, offset + 7);
      checksum = parseInt(fragment, 10) % 97;
  }
  return checksum;
};

// Validate the BIC
// https://github.com/Simplify/ibantools/blob/5fd5ee593f46e2ee0d09626a7db9256ce15fa996/src/ibantools.ts#L459
const validateBic = (input) => {
  const reg = /^[a-zA-Z]{6}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?$/gm;
  return reg.test(input);
}

export default defineNuxtPlugin(nuxtApp => {

  // Define a custom rules for date and time fields
  defineRule('arrayLengthBetween', (value, args) => {
    return arrayLengthBetween(value, args);
  });

  // Define the custom rule for the pgp key fingerprint field
  defineRule('checkPGPKey', (value, [target], _ctx) => {
    return checkPGPKey(nuxtApp, value, [target], _ctx);
  });

  // Define a custom rule for the sepa iban field
  defineRule('validateIban', (value) => {
    return validateIban(value);
  });

  // Define a custom rule for the sepa bic field
  defineRule('validateBic', (value) => {
    return validateBic(value);
  });

  // Import the localized messages for all the custom rules and configure them
  // Make sure that the rule name is the same as the localization key imported
  // Once the naming rule is respected, this code doesn't need to be changed if new rules are added
  // https://vitejs.dev/guide/features.html#glob-import
  const files = import.meta.glob('../lang/*.js',  {
    import: 'default',
    eager: true
  });

  // build the localization object
  // Load all the properties in the customRules object except the ones starting with _
  const localizedStringsObject = locales.reduce((translationsObject, locale) => {

    const customRulesJson = files[`../lang/${locale.code}.js`].customRules;

    const messages = Object.keys(customRulesJson).reduce((stringsObject, prop) => {

      if (!prop.startsWith('_')) {

        // stringsObject[prop] = customRulesJson[prop].loc.source;

        stringsObject[prop] = customRulesJson[prop]({
          normalize: (arr) => arr.map((_e, i) => arr[i]).join(''),
          interpolate: (str) => `{${str}}`,
          named: (str) => str
        });
      }

      return stringsObject;
    }, {})

    translationsObject[locale.code] = {
      code: locale.validate,
      messages
    };

    return translationsObject;
  }, {});
  
  // configure localized messages
  configure({
    generateMessage: localize(localizedStringsObject),
  })
});

