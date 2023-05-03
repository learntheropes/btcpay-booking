export default {
  profile: "Profile",
  // components/merchantServiceSelector.vue
  offers: "Offers you can book",
  // components/serviceBookingForm.vue
  buyerDate: "Date",
  buyerTime: "Time",
  selectDateFirst: "Select a date first",
  from: "From",
  to: "to",
  buyerExtras: "Extras",
  buyerName: "Name",
  buyerEmail: "Email",
  buyerFingerprint: "PGP public key fingerprint",
  buyerPGP: "PGP public key",
  fingerprintOnServer: "Make sure the public key is present at keys.openpgp.org",
  buyerDetails: "Details",
  buyerLanguage: "Language",
  buyerService: "Service",
  buyerGateway: "Payment type",
  bookEvent: "Book",
  // components/invoiceProfile.vue
  invoice: "Invoice",
  booking: "Booking",
  surcharge: "Due to payment processor fee, we are forced to charge a {surcharge}% surcharge on shitcoins payment ({gateways}).",
  and: "and",
  notProvided: "Not provided",
  // components/invoiceBitcoinNew.vue
  invoiceNew: "New invoice",
  invoiceId: "Invoice ID",
  oderId: "Order ID",
  viewDetails: "View details",
  hideDetails: "Hide details",
  totalPrice: "Total price",
  totalFiat: "Total fiat",
  exchangeRate: "Exchange rate",
  amountDue: "Amount due",
  recommendedFee: "Recommended Fee",
  payWith: "Pay with",
  bitcoin: "Bitcoin",
  lightning: "Lightning",
  address: "Address",
  invoice: "Invoice",
  amount: "Amount",
  payInWallet: "Pay in wallet",
  // components/invoiceBitcoinExpired.vue
  invoiceExpired: "Invoice expired",
  invoiceValidity: "A bitcoin invoice is only valid for {minutes} minutes",
  payWithBitcoin: "Pay with Bitcoin",
  // components/invoiceBitcoinReceived.vue
  invoicePaid: "Invoice paid",
  invoiceReceived: "have been paid",
  printReceipt: "Print receipt",
  // error,vue
  pageNotFound: "This page could not be found",
  unauthorized: "Unauthorized",
  somethingWentWrong: "Something went wrong",
  backToTheHomePage: "Back to the home page",
  // plugins/validateCustomRules.js
  customRules: {
    arrayLengthBetween: "You can book between 0:{min} and 1:{max} slots per day",
    _isOnServer: "We did not find a public key on the keys.openpgp.org server\nassociated with the fingerprint provided",
    _isAssociatedWithEmail: "The public key with fingerprint provided\nis not associated with the email {target}"
  }
}