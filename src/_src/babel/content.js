'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

HTMLTextAreaElement.prototype.setCaretPosition = function (start, end) {
    end = typeof end !== 'undefined' ? end : start;
    this.selectionStart = start;
    this.selectionEnd = end;
    this.focus();
}; /* global Ext, $ */
/* eslint class-methods-use-this: "off" */
/* eslint no-use-before-define: "off" */
/* eslint no-useless-escape: "off" */
/* eslint no-control-regex: "off" */


HTMLTextAreaElement.prototype.hasSelection = function () {
    if (this.selectionStart === this.selectionEnd) {
        return false;
    }
    return true;
};

HTMLTextAreaElement.prototype.isMultilineSelection = function () {
    var re = /(\n)/g;
    if ((this.value.substring(this.selectionStart, this.selectionEnd).match(re) || []).length > 0) {
        return true;
    }
    return false;
};

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
        key: 'addKeyDownSendListener',
        value: function addKeyDownSendListener() {
            var _this = this;

            $(document).delegate('textarea.textarea', 'keydown', function (event) {
                if (!event) {
                    var _event = window.event;
                }
                var form = $(event.target.form);
                var button = $('button[type="submit"]', form);
                if ((event.ctrlKey || event.metaKey) && (event.keyCode === 13 || event.keyCode === 10)) {
                    if (_this.Options.use_kbd) {
                        button.click();
                    }
                }
            });
        }
    }, {
        key: 'switchToolbar',
        value: function switchToolbar() {
            var toolbars = $('div.twpwyg_toolbar');

            if (toolbars && toolbars.length) {
                if (this.Options.show_toolbar) {
                    $.each(toolbars, function (i, toolbar) {
                        $(toolbar).removeClass('hidden');
                    });
                } else {
                    $.each(toolbars, function (i, toolbar) {
                        $(toolbar).addClass('hidden');
                    });
                }
            } else {
                if (!this.Options.show_toolbar) {
                    return;
                }

                var commentForms = $('form.form_comments[role$="comment_form"]');

                if (commentForms.length > 0) {
                    fetch(_utils.Device.extension.getURL('resources/twpwyg.js'), {
                        credentials: 'include'
                    }).then(function (response) {
                        return response.text();
                    }).then(function (script) {
                        $('<script/>').html(script).appendTo($('head'));
                    }).catch(console.error);

                    $('<link/>', {
                        rel: 'stylesheet',
                        href: _utils.Device.extension.getURL('css/foundation-icons.min.css')
                    }).appendTo($('head'));

                    fetch(_utils.Device.extension.getURL('resources/toolbar.html'), {
                        credentials: 'include'
                    }).then(function (response) {
                        return response.text();
                    }).then(function (toolbar) {
                        $.each(commentForms, function (i, form) {
                            var field_wrap = $('div.field_wrap', form);
                            field_wrap.prepend($(toolbar));
                        });
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
            var aside = $('aside.layout__navbar[role="navbar"]');

            try {
                aside.children('ul.events-list').remove();
            } catch (e) {}

            if (html) {
                aside.append($(html));
            }
        }
    }, {
        key: 'switchTopPanel',
        value: function switchTopPanel() {
            var topPanel = $('div.tmservices-panel[role="tm_panel"]');

            if (this.Options.hide_top_panel) {
                topPanel.addClass('hidden');
            } else {
                topPanel.removeClass('hidden');
            }
        }
    }, {
        key: 'switchRightSidebar',
        value: function switchRightSidebar() {
            var mainPage = $('main.page');

            if (this.Options.hide_right_sidebar) {
                mainPage.css({
                    marginRight: '0px'
                });
            } else {
                mainPage.css({
                    marginRight: '300px'
                });
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
                        this.addKeyDownSendListener();
                        break;
                }
            }
        }
    }, {
        key: 'sendMessageToBackgroundScript',
        value: function sendMessageToBackgroundScript(request) {
            _utils.Device.runtime.sendMessage(request, {}, callbackMessage);
        }
    }]);
    return Extension;
}();

window.Ext = new Extension();

_utils.Device.runtime.onMessage.addListener(callbackMessage);

window.Ext.sendMessageToBackgroundScript({
    cmd: 'options'
});

$(document).delegate('textarea.textarea', 'keydown', function (e) {
    if (!e) {
        var _e = window.event;
    }

    if (e.keyCode !== 9 || event.ctrlKey || event.metaKey || e.altKey) return;

    var target = e.target;
    var selectionStart = target.selectionStart;
    var selectionEnd = target.selectionEnd;

    var lineStart = selectionStart;
    for (lineStart = selectionStart; lineStart >= 0 && target.value[lineStart] !== '\n'; lineStart--) {}

    var lineEnd = selectionEnd;
    for (lineEnd = selectionEnd; lineEnd < target.value.length && target.value[lineEnd] !== '\n'; lineEnd++) {}

    var text = target.value.substring(lineStart, lineEnd);

    var tabString = '\t';

    // Are we selecting multiple lines?
    if (this.hasSelection() && this.isMultilineSelection()) {
        var numChanges = 0;
        var firstLineNumChanges = 1;

        if (!e.shiftKey) {
            // Normal Tab
            var re = new RegExp('(\n[ ]*)', 'g');

            numChanges = (text.match(re) || []).length;

            text = text.replace(re, '$1' + tabString);
        } else {
            // Shift+Tab
            var _re = new RegExp('(\n[ ]*)' + tabString, 'g');

            numChanges = (text.match(_re) || []).length;

            var indexOfNewLine = 1;
            for (indexOfNewLine = 1; indexOfNewLine < text.length && text[indexOfNewLine] !== '\n'; ++indexOfNewLine) {}
            firstLineNumChanges = (text.substring(0, indexOfNewLine).match(_re) || []).length;

            text = text.replace(_re, '$1');
        }

        target.value = target.value.substring(0, lineStart) + text + target.value.substring(lineEnd, target.value.length);

        // Keep the selection we had before
        var newSelectionStart = selectionStart + tabString.length * (!e.shiftKey ? 1 : -1) * firstLineNumChanges;
        var newSelectionEnd = selectionEnd + tabString.length * numChanges * (!e.shiftKey ? 1 : -1);

        this.setCaretPosition(newSelectionStart, newSelectionEnd);
    } else {
        // We are not in multiline so
        // we should add a tab at the position
        // only shift-tab if there is a tab present before
        if (!e.shiftKey) {
            // Normal Tab
            target.value = target.value.substring(0, selectionStart) + tabString + target.value.substring(selectionEnd, target.value.length);

            target.setCaretPosition(selectionStart + tabString.length, selectionEnd + tabString.length);
        } else if (target.value.substring(selectionStart - tabString.length, selectionStart) === tabString) {
            // Shift+Tab
            target.value = target.value.substring(0, selectionStart - tabString.length) + target.value.substring(selectionEnd, target.value.length);
            target.setCaretPosition(selectionStart - tabString.length, selectionEnd - tabString.length);
        }
    }
    return false;
});