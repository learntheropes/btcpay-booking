export default defineEventHandler(async (event) => {
  
  const invoiceId = event.context.params.invoiceId
  return await greenfieldApi(`/invoices/${invoiceId}/payment-methods`, event)
})