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


var callbackMessage = function callbackMessage(request, sender, callback) {
    window.Ext.callbackMessage(request, sender, callback);
};

var Extension = function () {
    function Extension() {
        (0, _classCallCheck3.default)(this, Extension);

        this.Options = {
            show_toolbar: true,
            use_kbd: true,
            hide_top_panel: true,
            hide_right_sidebar: true
        };
    }

    (0, _createClass3.default)(Extension, [{
        key: 'addKeyDownListener',
        value: function addKeyDownListener() {
            var _this = this;

            var textareas = utils.$$('textarea.textarea');

            var _loop = function _loop(i) {
                var textarea = textareas[i];
                var form = textarea.form;
                var button = utils.$('button[type="submit"]', form);
                textarea.addEventListener('keydown', function (event) {
                    if (!event) {
                        var _event = window.event;
                    }
                    if ((event.ctrlKey || event.metaKey) && (event.keyCode === 13 || event.keyCode === 10)) {
                        if (_this.Options.use_kbd) {
                            button.click();
                        }
                    }
                });
            };

            for (var i = 0; i < textareas.length; i++) {
                _loop(i);
            }
        }
    }, {
        key: 'switchToolbar',
        value: function switchToolbar() {
            var toolbars = utils.$$('div.twpwyg_toolbar');

            if (toolbars && toolbars.length) {
                if (this.Options.show_toolbar) {
                    for (var i = 0; i < toolbars.length; i++) {
                        toolbars[i].classList.remove('hidden');
                    }
                } else {
                    for (var _i = 0; _i < toolbars.length; _i++) {
                        toolbars[_i].classList.add('hidden');
                    }
                }
            } else {
                if (!this.Options.show_toolbar) {
                    return;
                }

                var commentForms = utils.$$('form.form_comments[role$="comment_form"]');

                if (commentForms) {
                    var script = document.createElement('script');
                    script.async = true;
                    script.src = Device.extension.getURL('resources/twpwyg.js');
                    utils.$('head').appendChild(script);

                    var toolbar_url = Device.extension.getURL('resources/toolbar.html');

                    fetch(toolbar_url, {
                        credentials: 'include'
                    }).then(function (response) {
                        return response.text();
                    }).then(function (body) {
                        for (var _i2 = 0; _i2 < commentForms.length; _i2++) {
                            var form = commentForms[_i2];
                            var field_wrap = utils.$('div.field_wrap', form);

                            var div = document.createElement('div');
                            div.appendChild(utils.createElement(body));
                            field_wrap.insertBefore(div, field_wrap.firstChild);
                        }
                    }).catch(console.error);
                }
            }
        }
    }, {
        key: 'updateAnswerList',
        value: function updateAnswerList(html) {}
    }, {
        key: 'updateCommentList',
        value: function updateCommentList(html) {}
    }, {
        key: 'updateSidebar',
        value: function updateSidebar(html) {
            var $aside = utils.$('aside.layout__navbar[role="navbar"]');
            var $event_list = utils.$('ul.events-list', $aside);

            try {
                $aside.removeChild($event_list);
            } catch (e) {}

            if (html) {
                $aside.insertAdjacentHTML('beforeend', html);
            }
        }
    }, {
        key: 'switchTopPanel',
        value: function switchTopPanel() {
            var topPanel = utils.$('div.tmservices-panel[role="tm_panel"]');
            if (this.Options.hide_top_panel) {
                topPanel.classList.add('hidden');
            } else {
                topPanel.classList.remove('hidden');
            }
        }
    }, {
        key: 'switchRightSidebar',
        value: function switchRightSidebar() {
            var mainPage = utils.$('main.page');
            if (this.Options.hide_right_sidebar) {
                mainPage.style.marginRight = '0px';
            } else {
                mainPage.style.marginRight = '300px';
            }
        }
    }, {
        key: 'callbackMessage',
        value: function callbackMessage(request, sender, callback) {
            if (request && request.cmd) {
                switch (request.cmd) {
                    case 'updateAnswerList':
                        // this.updateAnswerList(request.data);
                        break;
                    case 'updateCommentList':
                        // this.updateCommentList(request.data);
                        break;
                    case 'updateSidebar':
                        this.updateSidebar(request.data);
                        break;
                    case 'options':
                    default:
                        this.Options = Object.assign({}, this.Options, request.data || {});
                        this.switchTopPanel();
                        this.switchRightSidebar();
                        this.switchToolbar();
                        this.addKeyDownListener();
                        break;
                }
            }
        }
    }, {
        key: 'sendMessageToBackgroundScript',
        value: function sendMessageToBackgroundScript(request) {
            Device.runtime.sendMessage(request, {}, callbackMessage);
        }
    }]);
    return Extension;
}();

window.Ext = new Extension();

Device.runtime.onMessage.addListener(callbackMessage);

window.Ext.sendMessageToBackgroundScript({
    cmd: 'options'
});