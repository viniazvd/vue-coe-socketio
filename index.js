import io from 'socket.io-client'

export default {
  install (Vue, address, options = {}) {
    if (!address || typeof address !== 'string') throw new Error('[vue-coe-websocket] cannot locate connection')

    const socket = io(address, options)

    const λ = Object.create(null)

    if (Reflect.set(λ, '$socket', socket)) {
      const addListeners = function () {
        if (this.$options['socket']) {
          const channel = Reflect.get(this.$options.socket, 'channel')
          const events = Reflect.get(this.$options.socket, 'events')

          // subscribe to a channel
          if (channel) socket.nsp = channel

          if (events) {
            // callback = events[event]
            const addListener = event => λ.$socket.on(event, events[event].bind(this))

            Object.keys(events).forEach(addListener)
          }
        }
      }

      const removeListeners = function () {
        if (this.$options['socket']) {
          const events = Reflect.get(this.$options.socket, 'events')

          if (events) {
            const callback = events[event]
            const removeListener = event => λ.$socket.off(event, callback)

            Object.keys(events).forEach(removeListener)

            λ.$socket.disconnect()
          }
        }
      }

      Vue.mixin({ beforeCreate: addListeners, beforeDestroy: removeListeners })

      Object.defineProperty(Vue.prototype, '$socket', { get: () => λ.$socket })
    } else {
      console.error('[vue-coe-websocket] cannot set the prototype')
    }
  }
}
