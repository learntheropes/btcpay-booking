export default defineEventHandler(async (event) => {
  
  return await greenfieldApi(`/invoices`, event)
})
