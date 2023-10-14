export default defineEventHandler(async (event) => {

  return await greenfieldApi(`/webhooks`, event);
});