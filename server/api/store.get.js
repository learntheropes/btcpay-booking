export default defineEventHandler(async (event) => {

  return await greenfieldApi(`/`, event);
});
