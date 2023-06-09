export default {
  profile: 'Profile',
  // components/merchantServiceSelector.vue
  offers: 'Offers you can book',
  // components/serviceBookingForm.vue
  buyerDate: 'Date',
  buyerTime: 'Time',
  selectDateFirst: 'Select a date first',
  from: 'From',
  to: 'to',
  buyerExtras: 'Extras',
  buyerName: 'Name',
  buyerEmail: 'Email',
  buyerFingerprint: 'PGP public key fingerprint',
  buyerPGP: 'PGP public key',
  fingerprintOnServer: 'Make sure the public key is present at keys.openpgp.org',
  buyerDetails: 'Details',
  buyerLanguage: 'Language',
  buyerService: 'Service',
  buyerGateway: 'Payment type',
  bookEvent: 'Book',
  clearSelection: 'Clear selection',
  in: 'in',
  // components/invoice/invoiceProfile.vue
  invoice: 'Invoice',
  booking: 'Booking',
  surcharge: 'Due to the payment processors, a fee will be charged on shitcoins payments ({gateways}).',
  and: 'and',
  notProvided: 'Not provided',
  // components/invoice/bitcoin/invoiceBitcoinNew.vue
  invoiceNew: 'New invoice',
  invoiceId: 'Invoice ID',
  oderId: 'Order ID',
  viewDetails: 'View details',
  hideDetails: 'Hide details',
  totalPrice: 'Total price',
  totalFiat: 'Total fiat',
  exchangeRate: 'Exchange rate',
  amountDue: 'Amount due',
  recommendedFee: 'Recommended Fee',
  payWith: 'Pay with',
  bitcoin: 'Bitcoin',
  lnurl: 'Lnurl',
  lightning: 'Lightning',
  address: 'Address',
  invoice: 'Invoice',
  amount: 'Amount',
  payInWallet: 'Pay in wallet',
  destinationCopied: 'Destination copied',
  amountCopied: 'Amount copied',
  // components/invoice/bitcoin/invoiceBitcoinExpired.vue
  invoiceExpired: 'Invoice expired',
  invoiceValidity: 'A bitcoin invoice is only valid for {minutes} minutes',
  payWithBitcoin: 'Pay with Bitcoin',
  // components/invoice/bitcoin/invoiceBitcoinReceived.vue
  invoicePaid: 'Invoice paid',
  invoiceReceived: 'have been paid',
  printReceipt: 'Print receipt',
  // components/invoice/fiat/invoiceFiatSelector.vue
  selectPaymentMethod: 'Choose a payment method',
  // components/invoice/fiat/invoiceFiatSepaForm.vue
  notSharedWithMerchant: 'Payer info are not shared with the merchant',
  buyerLegalName: 'First and last name',
  buyerLegalAddress: 'Address',
  buyerLegalCity: 'City',
  buyerLegalZip: 'ZIP Code',
  buyerLegalCountry: 'Country',
  buyerBic: 'Bank BIC',
  buyerIban: 'IBAN',
  getPaymentDetails: 'Get payment details',
  // components/invoice/fiat/invoiceFiatSepaDetails.vue
  amount: 'Amount',
  currency: 'Currency',
  iban: 'IBAN',
  bic: 'Bank BIC',
  reference: 'Reference',
  recipient: 'Recipient',
  recipientAddress: 'Recipient address',
  copied: 'Copied',
  // error.vue
  pageNotFound: 'This page could not be found',
  unauthorized: 'Unauthorized',
  somethingWentWrong: 'Something went wrong',
  backToTheHomePage: 'Back to the home page',
  // plugins/validateCustomRules.js
  // Custom rules which name starts with an underscore
  // are not automatically imported in vee validate generateMessage
  // but returned directly within the custom rule function
  customRules: {
    arrayLengthBetween: 'You can book between 0:{min} and 1:{max} slots per day',
    validateIban: 'Invalid IBAN format',
    validateBic: 'Invalid bank BIC',
    _isOnServer: 'We did not find a public key on the keys.openpgp.org server\nassociated with the fingerprint provided',
    _isAssociatedWithEmail: 'The public key with fingerprint provided\nis not associated with the email {target}'
  }
}
