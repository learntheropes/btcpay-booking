import mitt from 'mitt'

export default defineNuxtPlugin(() => {

  const emitter = mitt()

  return {
    provide: {
      // Will emit an event
      event: emitter.emit,
      // Will register a listener for an event
      listen: emitter.on
    }
  }
});
