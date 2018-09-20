'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var io = _interopDefault(require('socket.io-client'));

var index = {
  install: function install(Vue, address) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (!address || typeof address !== 'string') throw new Error('[vue-coe-websocket] cannot locate connection');
    var socket = io(address, options);
    var λ = Object.create(null);

    if (Reflect.set(λ, '$socket', socket)) {
      var addListeners = function addListeners() {
        var _this = this;

        if (this.$options['socket']) {
          var channel = Reflect.get(this.$options.socket, 'channel');
          var events = Reflect.get(this.$options.socket, 'events'); // subscribe to a channel

          if (channel) socket.nsp = channel;

          if (events) {
            // callback = events[event]
            var addListener = function addListener(event) {
              return λ.$socket.on(event, events[event].bind(_this));
            };

            Object.keys(events).forEach(addListener);
          }
        }
      };

      var removeListeners = function removeListeners() {
        if (this.$options['socket']) {
          var events = Reflect.get(this.$options.socket, 'events');

          if (events) {
            var callback = events[event];

            var removeListener = function removeListener(event) {
              return λ.$socket.off(event, callback);
            };

            Object.keys(events).forEach(removeListener);
            λ.$socket.disconnect();
          }
        }
      };

      Vue.mixin({
        beforeCreate: addListeners,
        beforeDestroy: removeListeners
      });
      Object.defineProperty(Vue.prototype, '$socket', {
        get: function get() {
          return λ.$socket;
        }
      });
    } else {
      console.error('[vue-coe-websocket] cannot set the prototype');
    }
  }
};

module.exports = index;
