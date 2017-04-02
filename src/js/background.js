(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":4}],2:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],3:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
},{"../core-js/object/define-property":1}],4:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};
},{"../../modules/_core":7,"../../modules/es6.object.define-property":20}],5:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],6:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":16}],7:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],8:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":5}],9:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":12}],10:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":13,"./_is-object":16}],11:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , ctx       = require('./_ctx')
  , hide      = require('./_hide')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":7,"./_ctx":8,"./_global":13,"./_hide":14}],12:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],13:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],14:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":9,"./_object-dp":17,"./_property-desc":18}],15:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":9,"./_dom-create":10,"./_fails":12}],16:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],17:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":6,"./_descriptors":9,"./_ie8-dom-define":15,"./_to-primitive":19}],18:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],19:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":16}],20:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperty: require('./_object-dp').f});
},{"./_descriptors":9,"./_export":11,"./_object-dp":17}],21:[function(require,module,exports){
'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useNotificationsFlag = 0; /* global Ext, $ */
/* eslint class-methods-use-this: "off" */
/* eslint no-use-before-define: "off" */

var chromeUninstallUrl = 'https://chrome.google.com/webstore/detail/toster-wysiwyg-panel/kpfolongmglpleidinnhnlefeoljdecm/reviews';
var operaUninstallUrl = 'https://addons.opera.com/extensions/details/toster-wysiwyg-panel/#feedback-container';
var ffUninstallUrl = 'https://addons.mozilla.org/firefox/addon/toster-wysiwyg-panel';

var uninstallurl = void 0;
if (_utils.isChrome && !_utils.isOpera) {
    uninstallurl = chromeUninstallUrl;
} else if (_utils.isOpera) {
    uninstallurl = operaUninstallUrl;
} else if (_utils.isFirefox) {
    uninstallurl = ffUninstallUrl;
}

var installHandler = function installHandler(details) {
    var currentVersion = _utils.Device.runtime.getManifest().version;
    window.Ext.updateIcon();
    window.Ext.synchronize();
    switch (details.reason) {
        case 'update':
            // console.log( `Updated from ${details.previousVersion} to ${currentVersion}!` );
            break;
        case 'install':
        default:
            // console.log( 'Extension installed!' );
            break;
    }
};

var callbackMessage = function callbackMessage(request, sender, callback) {
    window.Ext.callbackMessage(request, sender, callback);
};

var Extension = function () {
    function Extension() {
        (0, _classCallCheck3.default)(this, Extension);

        this.defaults = Object.freeze({
            home_url: 'https://github.com/yarkovaleksei/toster-wysiwyg-panel',
            feedback_url: uninstallurl,
            ajax: true,
            interval: 10,
            use_kbd: true,
            use_tab: true,
            use_notifications: false,
            use_badge_icon: true,
            hide_top_panel: true,
            hide_right_sidebar: true,
            feed_url: 'https://toster.ru/my/feed',
            tracker_url: 'https://toster.ru/my/tracker',
            new_question_url: 'https://toster.ru/question/new'
        });
        this.Options = Object.assign({}, this.defaults);
    }

    (0, _createClass3.default)(Extension, [{
        key: 'loadOptions',
        value: function loadOptions() {
            var options = localStorage.getItem('options');

            if (options) {
                this.Options = Object.assign({}, this.defaults, JSON.parse(options));
            } else {
                this.saveOptions();
            }

            return this.Options;
        }
    }, {
        key: 'saveOptions',
        value: function saveOptions() {
            localStorage.setItem('options', JSON.stringify(this.Options));
            this.synchronize();
        }
    }, {
        key: 'getNotifyPage',
        value: function getNotifyPage() {
            this.updateIcon({
                loading: true
            });
            return fetch(this.Options.tracker_url, {
                credentials: 'include'
            }).then(function (response) {
                return response.text();
            }).catch(console.error);
        }
    }, {
        key: 'stopTimer',
        value: function stopTimer() {
            _utils.Device.alarms.clear('checkUnread', function (wasCleared) {
                return wasCleared;
            });
        }
    }, {
        key: 'reStartTimer',
        value: function reStartTimer() {
            this.stopTimer();
            this.startTimer();
        }
    }, {
        key: 'checkUnread',
        value: function checkUnread() {
            var _this = this;

            this.getNotifyPage().then(function (body) {
                var event_list = $(body).find('ul.events-list')[0];
                var count = 0;

                if ($(event_list)) {
                    var events_items = $(event_list).find('li');

                    if (events_items.length > 3) {
                        var text = $(events_items).last().text().replace(/[^\d]/g, '');
                        count = parseInt(text, 10);
                    } else {
                        count = events_items.length;
                    }

                    if (_this.Options.use_notifications && useNotificationsFlag === 0) {
                        _this.createNotify({
                            count: count
                        });
                    }

                    if (_this.Options.use_badge_icon) {
                        _this.updateIcon({
                            count: count
                        });
                    }

                    useNotificationsFlag = count;

                    _this.sendMessageToContentScript({
                        cmd: 'updateSidebar',
                        data: $(event_list)[0].outerHTML || ''
                    });
                } else {
                    _this.updateIcon({
                        count: 0
                    });
                    useNotificationsFlag = 0;
                }
            });
        }
    }, {
        key: 'startTimer',
        value: function startTimer() {
            if (!this.Options.ajax || this.Options.interval === 0) {
                return false;
            }

            _utils.Device.alarms.create('checkUnread', {
                when: Date.now() + this.Options.interval * 1000
            });
        }
    }, {
        key: 'callbackMessage',
        value: function callbackMessage(request, sender, callback) {
            this.loadOptions();
            if (request && request.cmd) {
                switch (request.cmd) {
                    case 'options':
                    default:
                        callback({
                            cmd: request.cmd,
                            data: this.Options
                        });
                        break;
                }
            }
        }
    }, {
        key: 'sendMessageToContentScript',
        value: function sendMessageToContentScript(params) {
            _utils.Device.tabs.query({}, function (tabs) {
                for (var i = 0; i < tabs.length; ++i) {
                    _utils.Device.tabs.sendMessage(tabs[i].id, params, callbackMessage);
                }
            });
        }
    }, {
        key: 'createNotify',
        value: function createNotify(params) {
            if (params && params.count > 0) {
                _utils.Device.notifications.create('toster.ru', {
                    type: 'basic',
                    title: (0, _utils._l)('unread_notifications_title'),
                    iconUrl: 'icon/svg/alarm.svg',
                    message: (0, _utils._l)('unread_notifications_message', [String(params.count)])
                }, function (id) {
                    return id;
                });
            }
        }
    }, {
        key: 'updateIcon',
        value: function updateIcon(params) {
            if (params && params.count) {
                _utils.Device.browserAction.setBadgeBackgroundColor({
                    color: '#ff0000'
                });
                _utils.Device.browserAction.setBadgeText({
                    text: String(params.count)
                });
                _utils.Device.browserAction.setTitle({
                    title: (0, _utils._l)('unread_notifications_message', [String(params.count)])
                });
            } else if (params && params.loading) {
                _utils.Device.browserAction.setBadgeBackgroundColor({
                    color: '#5e5656'
                });
                _utils.Device.browserAction.setBadgeText({
                    text: '...'
                });
            } else {
                _utils.Device.browserAction.setBadgeText({
                    text: ''
                });
                _utils.Device.browserAction.setTitle({
                    title: (0, _utils._l)('extension_name')
                });
            }
        }
    }, {
        key: 'synchronize',
        value: function synchronize() {
            this.loadOptions();
            this.reStartTimer();
            this.sendMessageToContentScript({
                cmd: 'options',
                data: this.Options
            });
        }
    }]);
    return Extension;
}();

window.Ext = new Extension();

_utils.Device.runtime.setUninstallURL(uninstallurl);

_utils.Device.runtime.onMessage.addListener(callbackMessage);

_utils.Device.notifications.onClosed.addListener(function (notifId, byUser) {
    _utils.Device.notifications.clear(notifId, function (wasCleared) {
        if (byUser) {
            _utils.Device.tabs.create({
                url: window.Ext.Options.tracker_url
            }, function (tab) {
                return tab;
            });
        }
    });
});

_utils.Device.alarms.onAlarm.addListener(function (alarm) {
    switch (alarm.name) {
        case 'checkUnread':
            if (window.Ext.Options.ajax && window.navigator.onLine) {
                window.Ext.checkUnread();
            }
            window.Ext.reStartTimer();
            break;
        default:
            break;
    }
});

_utils.Device.runtime.onInstalled.addListener(installHandler);
},{"./utils":22,"babel-runtime/helpers/classCallCheck":2,"babel-runtime/helpers/createClass":3}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var createElement = exports.createElement = function createElement(str, parent) {
    var elem = (parent || document).createElement('div');
    elem.innerHTML = str;
    if (elem.childNodes.length > 0) {
        return elem.childNodes[0];
    }
    return elem;
};

var isChrome = exports.isChrome = window.chrome && window.chrome.webstore;

var isOpera = exports.isOpera = window.opr && window.opr.addons || window.opera || /opr\//i.test(window.navigator.userAgent);

var isFirefox = exports.isFirefox = typeof InstallTrigger !== 'undefined' || /firefox/i.test(window.navigator.userAgent);

var Device = exports.Device = function () {
    if (typeof browser === 'undefined') {
        return chrome;
    }
    return browser;
}();

var _l = exports._l = function _l(msg, placeholders) {
    if (Array.isArray(placeholders)) {
        return Device.i18n.getMessage(msg, placeholders);
    }
    return Device.i18n.getMessage(msg);
};

var openWin = exports.openWin = function openWin(url) {
    return window.open(url, 'wName');
};
},{}]},{},[21]);
