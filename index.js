import io from 'socket.io-client'

export default {
  install (Vue, connection) {
    if (!connection) throw new Error('[vue-coe-websocket] cannot locate connection')

    Vue.mixin({
      created () {
        const socket = io(connection)
        socket.onevent = packet => this.emit(packet.data)

        Vue.prototype.$socket = socket

        const sockets = this.$options['sockets']

        if (sockets) {
          this.$options.sockets = new Proxy({}, {
            set: (obj, event, callback) => {
              this.sockets = [ ...this.sockets, { event, callback } ]

              return Reflect.set(obj, event, callback)
            },

            // fix later
            deleteProperty: (target, event) => Reflect.deleteProperty(target, event)
          })

          Object.keys(sockets).forEach(event => (this.$options.sockets[event] = sockets[event]))
        }
      },

      data () {
        return {
          sockets: []
        }
      },

      methods: {
        emit ([ event, payload ]) {
          const listener = this.sockets.find(listener => event === listener.event)

          if (listener && listener.callback) listener.callback.call(this, payload)
        }
      },

      beforeDestroy () {
        if (this.$options['sockets']) {
          Object.keys(this.$options['sockets']).forEach(event => delete this.$options.sockets[event])
        }
      }
    })
  }
}
