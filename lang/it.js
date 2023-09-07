export default {
  profile: 'Profilo',
  // components/merchantServiceSelector.vue
  offers: 'Offerte che puoi prenotare',
  // components/serviceBookingForm.vue
  buyerDate: 'Data',
  buyerTime: 'Orario',
  selectDateFirst: 'Seleziona una data',
  from: 'Dalle',
  to: 'alle',
  buyerExtras: 'Extra',
  buyerName: 'Nome',
  buyerEmail: 'Email',
  buyerFingerprint: 'Impronta digitale della chiave pubblica PGP',
  buyerPGP: 'Chiave pubblica PGP',
  fingerprintOnServer: 'Assicurati che la chiave pubblica sia presente su keys.openpgp.org',
  buyerDetails: 'Dettagli',
  buyerLanguage: 'Lingua',
  buyerService: 'Servizio',
  buyerGateway: 'Tipo di pagamento',
  bookEvent: 'Prenota',
  clearSelection: 'Rimuovi selezione',
  in: 'in',
  getDiscount: 'Ottieni un {premium}% di sconto pagando in bitcoin',
  approximatePrice: 'Il prezzo in valuta tradizionale è approssimato. Il prezzo finale è stabilito al checkout',
  fiatNotAvailable: 'Metodi di pagamento in valute tradizionali non disponibili al momento',
  changeCurrency: 'Cambia valuta',
  // components/invoice/invoiceProfile.vue
  invoice: 'Fattura',
  booking: 'Prenotazione',
  surcharge: 'A causa degli elaboratori di pagamenti, sarà addebitata una commissione sui pagamenti in shitcoin ({gateways}).',
  and: 'e',
  notProvided: 'Non fornito',
  // components/invoice/bitcoin/invoiceBitcoinNew.vue
  invoiceNew: 'Nuova fattura',
  invoiceId: 'ID della fattura',
  oderId: 'ID dell\'ordine',
  viewDetails: 'Visualizza dettagli',
  hideDetails: 'Nascondi dettagli',
  totalPrice: 'Prezzo totale',
  totalFiat: 'Totale fiat',
  exchangeRate: 'Tasso di cambio',
  amountDue: 'Importo dovuto',
  recommendedFee: 'Commissione consigliata',
  payWith: 'Paga con',
  bitcoin: 'Bitcoin',
  lnurl: 'Lnurl',
  lightning: 'Lightning',
  address: 'Indirizzo',
  invoice: 'Fattura',
  amount: 'Quantità',
  payInWallet: 'Paga col portafoglio',
  destinationCopied: 'Destinatiozione copiata',
  amountCopied: 'Valore copiato',
  // components/invoice/bitcoin/invoiceBitcoinExpired.vue
  invoiceExpired: 'Fattura scaduta',
  invoiceValidity: 'Una fattura in bitcoin è valida solo per {minutes} minuti',
  payWithBitcoin: 'Paga con Bitcoin',
  // components/invoice/bitcoin/invoiceBitcoinReceived.vue
  invoicePaid: 'Fattura pagata',
  invoiceReceived: 'sono stati pagati',
  printReceipt: 'Stampa la ricevuta',
  // components/invoice/fiat/invoiceFiatSelector.vue
  selectPaymentMethod: 'Seleziona un metodo di pagamento',
  // components/invoice/fiat/invoiceFiatSepaForm.vue
  notSharedWithMerchant: 'Le informazioni del pagante non sono condivise col prestatore del servizio',
  buyerLegalName: 'Nome e cognome',
  buyerLegalAddress: 'Indirizzo',
  buyerLegalCity: 'Città',
  buyerLegalZip: 'Codice postale',
  buyerLegalCountry: 'Paese',
  buyerBic: 'BIC della banca',
  buyerIban: 'IBAN',
  getPaymentDetails: 'Ricevi gli estremi del pagamento',
  // components/invoice/fiat/invoiceFiatSepaDetails.vue
  amount: 'Importo',
  currency: 'Valuta',
  iban: 'IBAN',
  bic: 'BIC',
  reference: 'Causale',
  recipient: 'Destinatario',
  recipientAddress: 'Indirizzo del destinatario',
    // component/layoutFooter.vue
  lastBuiltAt: 'Último commit al blocco',
  merchantDashboard: 'Dashboard del commerciante',
  // pages/dashboard/index.vue
  underConstruction: 'In costruzione',
  // errorv.ue
  pageNotFound: 'Pagina non trovata',
  unauthorized: 'Non autorizzato',
  somethingWentWrong: 'Qualcosa è andato storto',
  backToTheHomePage: 'Tornare alla pagina principale',
  // plugins/validateCustomRules.js
  // Custom rules which name starts with an underscore
  // are not automatically imported in vee validate generateMessage
  // but returned directly within the custom rule function
  customRules: {
    arrayLengthBetween: 'Puoi prenotare tra i 0:{min} e i 1:{max} slot per ogni giornata',
    validateIban: 'Formato IBAN non valido',
    validateBic: 'BIC della banca non valido',
    _isOnServer: 'Non abbiamo trovato una chiave pubblica sul server\nkeys.openpgp.org\nassociata alla impronta digitale fornita',
    _isAssociatedWithEmail: 'La chiave pubblica con impronta digitale forinita\nnon è associata con la email {target}'
  }
}
