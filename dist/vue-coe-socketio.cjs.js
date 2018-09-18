'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var io = _interopDefault(require('socket.io-client'));

var index = {
  install: function install(Vue, address) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (!address || typeof address !== 'string') throw new Error('[vue-coe-websocket] cannot locate connection');
    var socket = io(address, options);
    Vue.prototype.$socket = socket;

    var addListeners = function addListeners() {
      var _this = this;

      if (this.$options['socket']) {
        var _this$$options$socket = this.$options.socket,
            _this$$options$socket2 = _this$$options$socket.events,
            events = _this$$options$socket2 === void 0 ? {} : _this$$options$socket2,
            _this$$options$socket3 = _this$$options$socket.channel,
            channel = _this$$options$socket3 === void 0 ? '' : _this$$options$socket3; // subscribe to a channel

        if (channel) socket.nsp = channel;

        if (events) {
          Object.keys(events).forEach(function (event) {
            var callback = events[event].bind(_this);

            _this.$socket.on(event, callback);
          });
        }
      }
    };

    var removeListeners = function removeListeners() {
      var _this2 = this;

      if (this.$options['socket']) {
        var _this$$options$socket4 = this.$options.socket.events,
            events = _this$$options$socket4 === void 0 ? {} : _this$$options$socket4;

        if (events) {
          var callback = events[event].__binded;

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
  }
};

module.exports = index;
