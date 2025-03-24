export default defineEventHandler(async (event) => {

  return await getGoogleCalendarsEvent(event);
});