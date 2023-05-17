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
    const file = await $fetch(`https://keys.openpgp.org/vks/v1/by-fingerprint/${fingerprint}`, {
      method: 'GET',
    })
    const publicKey = await file.text()

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

export default defineNuxtPlugin(nuxtApp => {

  // Define a custom rules for date and time fields
  defineRule('arrayLengthBetween', (value, args) => {
    return arrayLengthBetween(value, args)
  });

  // Define the custom rule for the pgp key fingerprint field
  defineRule('checkPGPKey', (value, [target], _ctx) => {
    return checkPGPKey(nuxtApp, value, [target], _ctx)
  });

  // Import the localized messages for all the custom rules and configure them
  // Make sure that the rule name is the same as the localization key imported
  // Once the naming rule is respected, this code doesn't need to be tached if new rules are added
  // https://vitejs.dev/guide/features.html#glob-import
  const modules = import.meta.glob('../lang/*.js',  {
    import: 'default',
    eager: true
  });

  // build the localization object
  // Load all the properties in the customRules object except the ones starting with _
  const localizeMessages = locales.reduce((obj, locale) => {

    const customRulesJson = modules[`../lang/${locale.code}.js`].customRules
    const customRulesProps = Object.keys(customRulesJson)

    const messages = customRulesProps.reduce((obj, prop) => {
      if (!prop.startsWith('_')) obj[prop] = customRulesJson[prop].source
      return obj
    }, {})

    obj[locale.code] = {
      code: locale.validate,
      messages
    }

    return obj
  }, {});
  
  // configure localized messages
  configure({
    generateMessage: localize(localizeMessages),
  })
});

