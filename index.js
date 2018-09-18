import io from 'socket.io-client'

export default {
  install (Vue, address, options = {}) {
    if (!address || typeof address !== 'string') throw new Error('[vue-coe-websocket] cannot locate connection')

    const socket = io(address, options)

    Vue.prototype.$socket = socket

    const addListeners = function () {
      if (this.$options['socket']) {
        const { events = {}, channel = '' } = this.$options.socket

        // subscribe to a channel
        if (channel) socket.nsp = channel

        if (events) {
          Object.keys(events).forEach(event => {
            const callback = events[event].bind(this)

            this.$socket.on(event, callback)
          })
        }
      }
    }

    const removeListeners = function () {
      if (this.$options['socket']) {
        const { events = {} } = this.$options.socket

        if (events) {
          const callback = events[event].__binded
          const removeListener = event => this.$socket.off(event, callback)

          Object.keys(events).forEach(removeListener)

          this.$socket.disconnect()
        }
      }
    }

    Vue.mixin({ beforeCreate: addListeners, beforeDestroy: removeListeners })
  }
}
