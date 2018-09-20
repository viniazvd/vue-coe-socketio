import io from 'socket.io-client'

export default {
  install (Vue, address, options = {}) {
    if (!address || typeof address !== 'string') throw new Error('[vue-coe-websocket] cannot locate connection')

    const socket = io(address, options)

    Vue.prototype.$socket = {}
    const isSet = Reflect.setPrototypeOf(Vue.prototype.$socket, socket)

    if (isSet) {
      const addListeners = function () {
        if (this.$options['socket']) {
          const channel = Reflect.get(this.$options.socket, 'channel')
          const events = Reflect.get(this.$options.socket, 'events')

          // subscribe to a channel
          if (channel) socket.nsp = channel

          if (events) {
            // callback = events[event]
            Object.keys(events).forEach(event => this.$socket.on(event, events[event].bind(this)))
          }
        }
      }

      const removeListeners = function () {
        if (this.$options['socket']) {
          const events = Reflect.get(this.$options.socket, 'events')

          if (events) {
            const callback = events[event]
            const removeListener = event => this.$socket.off(event, callback)

            Object.keys(events).forEach(removeListener)

            this.$socket.disconnect()
          }
        }
      }

      Vue.mixin({
        beforeCreate: addListeners,
        beforeDestroy: removeListeners
      })
    } else {
      console.error('[vue-coe-websocket] cannot set the prototype')
    }
  }
}
