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
  getDiscount: 'Get a {premium}% discount paying in bitcoin.',
  approximatePrice: 'Traditional currencies price is approximate. The final price is set at checkout.',
  fiatNotAvailable: 'Traditional currencies payment methods not available at the moment.',
  changeCurrency: 'Change currency',
  // components/invoice/invoiceProfile.vue
  invoice: 'Invoice',
  booking: 'Booking',
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
  // component/invoice/fiat/invoiceFiatWarning.vue
  bitcoinPurchaseWarning: 'We only accept bitcoins as the final method of payment.\n\nWe are now going to let you buy bitcoin with {paymentMethod} from a friendly peer and send them to us.\n\nDon\'t worry, we will make the process easy and hassle free for you in a few clicks.\n\nWe will send you a notification about the payment details as soon as they will be available.\n\nWe will also show the payment details and any additional communication on this page. Please bookmark this page.',
  // component/invoice/fiat/invoiceFiatPaymentDetails.vue
  sellerPaymentDetails: "Payment details",
  method: 'Method',
  reference: 'Reference',
  phone: 'Phone',
  beneficiary: 'Beneficiary',
  accountNumber: 'Account Number',
  userName: 'Username',
  ukBankAccount: 'UK bank account',
  ukSortCode: 'UK sort code',
  email: 'Email',
  iban: 'IBAN',
  bic: 'BIC',
  copied: '{key} copied',
  newChatMessage: 'New message',
  postChatMessage: 'Post',
  // component/invoice/fiat/invoiceBackup.vue
  backupWarning: 'To keep the bitcoins secure, please save the backup. You can copy or download it.',
  // component/layoutFooter.vue
  lastBuiltAt: 'Last built at block',
  merchantDashboard: 'Merchant dashboard',
  // pages/dashboard/index.vue
  underConstruction: 'Under construction',
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
