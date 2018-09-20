import io from 'socket.io-client';

var index = {
  install: function install(Vue, address) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (!address || typeof address !== 'string') throw new Error('[vue-coe-websocket] cannot locate connection');
    var socket = io(address, options);
    Vue.prototype.$socket = {};
    var isSet = Reflect.setPrototypeOf(Vue.prototype.$socket, socket);

    if (isSet) {
      var addListeners = function addListeners() {
        var _this = this;

        if (this.$options['socket']) {
          var channel = Reflect.get(this.$options.socket, 'channel');
          var events = Reflect.get(this.$options.socket, 'events'); // subscribe to a channel

          if (channel) socket.nsp = channel;

          if (events) {
            // callback = events[event]
            Object.keys(events).forEach(function (event) {
              return _this.$socket.on(event, events[event].bind(_this));
            });
          }
        }
      };

      var removeListeners = function removeListeners() {
        var _this2 = this;

        if (this.$options['socket']) {
          var events = Reflect.get(this.$options.socket, 'events');

          if (events) {
            var callback = events[event];

            var removeListener = function removeListener(event) {
              return _this2.$socket.off(event, callback);
            };

            Object.keys(events).forEach(removeListener);
            this.$socket.disconnect();
          }
        }
      };

      Vue.mixin({
        beforeCreate: addListeners,
        beforeDestroy: removeListeners
      });
    } else {
      console.error('[vue-coe-websocket] cannot set the prototype');
    }
  }
};

export default index;
