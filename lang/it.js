export default {
  profile: "Profilo",
  // components/merchantServiceSelector.vue
  offers: "Offerte che puoi prenotare",
  // components/serviceBookingForm.vue
  buyerDate: "Data",
  buyerTime: "Orario",
  selectDateFirst: "Seleziona una data",
  from: "Dalle",
  to: "alle",
  buyerExtras: "Extra",
  buyerName: "Nome",
  buyerEmail: "Email",
  buyerFingerprint: "Impronta digitale della chiave pubblica PGP",
  buyerPGP: "Chiave pubblica PGP",
  fingerprintOnServer: "Assicurati che la chiave pubblica sia presente su keys.openpgp.org",
  buyerDetails: "Dettagli",
  buyerLanguage: "Lingua",
  buyerService: "Servizio",
  buyerGateway: "Tipo di pagamento",
  bookEvent: "Prenota",
  // components/invoiceProfile.vue
  invoice: "Fattura",
  booking: "Prenotazione",
  surcharge: "A causa della commissione dell'elaboratore di pagamenti, siamo costretti ad addebitare un supplemento del {surcharge}% sul pagamento in shitcoin ({gateways}).",
  and: "e",
  notProvided: "Non fornito",
  // components/invoiceBitcoinNew.vue
  invoiceNew: "Nuova fattura",
  invoiceId: "ID della fattura",
  oderId: "ID dell' ordine",
  viewDetails: "Visualizza dettagli",
  hideDetails: "Nascondi dettagli",
  totalPrice: "Prezzo totale",
  totalFiat: "Totale fiat",
  exchangeRate: "Tasso di cambio",
  amountDue: "Importo dovuto",
  recommendedFee: "Commissione consigliata",
  payWith: "Paga con",
  bitcoin: "Bitcoin",
  lightning: "Lightning",
  address: "Indirizzo",
  invoice: "Fattura",
  amount: "Quantità",
  payInWallet: "Paga col portafoglio",
  // components/invoiceBitcoinExpired.vue
  invoiceExpired: "Fattura scaduta",
  invoiceValidity: "Una fattura in bitcoin è valida solo per {minutes} minuti",
  payWithBitcoin: "Paga con Bitcoin",
  // components/invoiceBitcoinReceived.vue
  invoicePaid: "Fattura pagata",
  invoiceReceived: "sono stati pagati",
  printReceipt: "Stampa la ricevuta",
  // error,vue
  pageNotFound: "Pagina non trovata",
  unauthorized: "Non autorizzato",
  somethingWentWrong: "Qualcosa è andato storto",
  backToTheHomePage: "Tornare alla pagina principale",
  // plugins/validateCustomRules.js
  customRules: {
    arrayLengthBetween: "Puoi prenotare tra i 0:{min} e i 1:{max} slot per ogni giornata",
    _isOnServer: "Non abbiamo trovato una chiave pubblica sul server\nkeys.openpgp.org\nassociata alla impronta digitale fornita",
    _isAssociatedWithEmail: "La chiave pubblica con impronta digitale forinita\nnon è associata con la email {target}"
  }
}