'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var io = _interopDefault(require('socket.io-client'));

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var index = {
  install: function install(Vue, connection) {
    if (!connection) throw new Error('[vue-coe-websocket] cannot locate connection');
    Vue.mixin({
      created: function created() {
        var _this = this;

        var socket = io(connection);

        socket.onevent = function (packet) {
          return _this.emit(packet.data);
        };

        Vue.prototype.$socket = socket;
        var sockets = this.$options['sockets'];

        if (sockets) {
          this.$options.sockets = new Proxy({}, {
            set: function set(obj, event, callback) {
              _this.sockets = _toConsumableArray(_this.sockets).concat([{
                event: event,
                callback: callback
              }]);
              return Reflect.set(obj, event, callback);
            },
            // fix later
            deleteProperty: function deleteProperty(target, event) {
              return Reflect.deleteProperty(target, event);
            }
          });
          Object.keys(sockets).forEach(function (event) {
            return _this.$options.sockets[event] = sockets[event];
          });
        }
      },
      data: function data() {
        return {
          sockets: []
        };
      },
      methods: {
        emit: function emit(_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              event = _ref2[0],
              payload = _ref2[1];

          var listener = this.sockets.find(function (listener) {
            return event === listener.event;
          });
          if (listener && listener.callback) listener.callback.call(this, payload);
        }
      },
      beforeDestroy: function beforeDestroy() {
        var _this2 = this;

        if (this.$options['sockets']) {
          Object.keys(this.$options['sockets']).forEach(function (event) {
            return delete _this2.$options.sockets[event];
          });
        }
      }
    });
  }
};

module.exports = index;
