export default defineNuxtRouteMiddleware((to, from) => {

  const {
    public: {
      defaultService
    }
  } = useRuntimeConfig();
    
  const nuxtApp = useNuxtApp();

  const { locale } = nuxtApp.$i18n;

  if (from && from.name && from.name.startsWith('index') && defaultService && to.path !== `/${locale.value}/${defaultService}`) {

    return navigateTo({
      path: `/${locale.value}/${defaultService}`, 
      redirectCode: 301 
    });
  }
})