'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Device = utils.Device; /* global Device, Ext, browser, chrome */
/* eslint class-methods-use-this: "off" */
/* eslint no-use-before-define: "off" */


var chromeUninstallUrl = 'https://chrome.google.com/webstore/detail/toster-wysiwyg-panel/kpfolongmglpleidinnhnlefeoljdecm/reviews';
var operaUninstallUrl = 'https://addons.opera.com/ru/extensions/details/toster-wysiwyg-panel/#feedback-container';
var ffUninstallUrl = 'https://addons.mozilla.org/en-US/firefox/addon/toster-wysiwyg-panel';

var setUninstallUrl = function setUninstallUrl() {
    var uninstallurl = '';
    if (utils.isChrome && !utils.isOpera) {
        uninstallurl = chromeUninstallUrl;
    } else if (utils.isOpera) {
        uninstallurl = operaUninstallUrl;
    } else if (utils.isFirefox) {
        uninstallurl = ffUninstallUrl;
    }
    Device.runtime.setUninstallURL(uninstallurl);
};

var installHandler = function installHandler(details) {
    var currentVersion = Device.runtime.getManifest().version;
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

        this.defaults = {
            ajax: true,
            interval: 10,
            show_toolbar: true,
            use_kbd: true,
            use_notifications: false,
            use_badge_icon: true,
            hide_top_panel: true,
            hide_right_sidebar: true,
            feed_url: 'https://toster.ru/my/feed',
            tracker_url: 'https://toster.ru/my/tracker',
            new_question_url: 'https://toster.ru/question/new'
        };
        this.Options = this.defaults;
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
            Device.alarms.clear('checkUnread', function (wasCleared) {
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

            this.getNotifyPage().then(function (_body) {
                var body = document.createElement('div');
                body.innerHTML = _body;
                var $event_list = utils.$('ul.events-list', body);
                var count = 0;

                if ($event_list) {
                    var events_items = utils.$$('li', $event_list);

                    if (events_items.length > 3) {
                        var text = $event_list.lastElementChild.textContent.replace(/[^\d]/g, '');
                        count = parseInt(text, 10);
                    } else {
                        count = events_items.length;
                    }

                    if (_this.Options.use_notifications) {
                        _this.createNotify({
                            count: count
                        });
                    }
                    if (_this.Options.use_badge_icon) {
                        _this.updateIcon({
                            count: count
                        });
                    }
                } else {
                    _this.updateIcon({
                        count: 0
                    });
                }

                _this.sendMessageToContentScript({
                    cmd: 'updateSidebar',
                    data: $event_list.outerHTML || ''
                });
            });
        }
    }, {
        key: 'startTimer',
        value: function startTimer() {
            if (!this.Options.ajax || this.Options.interval === 0) {
                return false;
            }

            Device.alarms.create('checkUnread', {
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
            Device.tabs.query({}, function (tabs) {
                for (var i = 0; i < tabs.length; ++i) {
                    Device.tabs.sendMessage(tabs[i].id, params, callbackMessage);
                }
            });
        }
    }, {
        key: 'createNotify',
        value: function createNotify(params) {
            if (params && params.count) {
                Device.notifications.create('toster.ru', {
                    type: 'basic',
                    title: utils._l('unread_notifications_title'),
                    iconUrl: 'icon/icon-48x48.png',
                    message: utils._l('unread_notifications_message', String(params.count))
                }, function (id) {
                    return id;
                });
            }
        }
    }, {
        key: 'updateIcon',
        value: function updateIcon(params) {
            if (params && params.count) {
                Device.browserAction.setBadgeBackgroundColor({
                    color: '#ff0000'
                });
                Device.browserAction.setBadgeText({
                    text: String(params.count)
                });
                Device.browserAction.setTitle({
                    title: utils._l('unread_notifications_message', [String(params.count)])
                });
            } else if (params && params.loading) {
                Device.browserAction.setBadgeBackgroundColor({
                    color: '#5e5656'
                });
                Device.browserAction.setBadgeText({
                    text: '...'
                });
            } else {
                Device.browserAction.setBadgeText({
                    text: ''
                });
                Device.browserAction.setTitle({
                    title: utils._l('extension_name')
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

setUninstallUrl();

window.Ext = new Extension();

Device.runtime.onMessage.addListener(callbackMessage);

Device.notifications.onClosed.addListener(function (notifId, byUser) {
    Device.notifications.clear(notifId, function (wasCleared) {
        if (byUser) {
            Device.tabs.create({
                url: window.Ext.Options.tracker_url
            }, function (tab) {
                return tab;
            });
        }
    });
});

Device.notifications.onClicked.addListener(function (notifId) {
    Device.notifications.clear(notifId, function (wasCleared) {
        if (wasCleared) {
            Device.tabs.create({
                url: window.Ext.Options.tracker_url
            }, function (tab) {
                return tab;
            });
        }
    });
});

Device.alarms.onAlarm.addListener(function (alarm) {
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

Device.runtime.onInstalled.addListener(installHandler);