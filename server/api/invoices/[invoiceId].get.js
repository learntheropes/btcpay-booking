export default defineEventHandler(async (event) => {

  const invoiceId = event.context.params.invoiceId;

  if (invoiceId) return await greenfieldApi(`/invoices/${invoiceId}`, event);
  else return await greenfieldApi(`/invoices`, event);
});