(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _utils = require('./utils');

$(document).ready(function () {
    var inputs = $('#options_form input[type!="button"]');

    var save_options = function save_options() {
        $.each(inputs, function (i, el) {
            var name = $(el).attr('id');
            var type = $(el).attr('type');
            var value = void 0;
            switch (type) {
                case 'checkbox':
                    value = $(el).prop('checked');
                    break;
                case 'number':
                    value = parseInt($(el).val(), 10);
                    break;
                case 'text':
                default:
                    value = $(el).val();
                    break;
            }
            window.Extension.Options[name] = value;
        });
        window.Extension.saveOptions();
    };

    var restore_options = function restore_options() {
        window.Extension.loadOptions();
        $.each(inputs, function (i, el) {
            var name = $(el).attr('id');
            var type = $(el).attr('type');
            switch (type) {
                case 'checkbox':
                    $(el).prop({
                        checked: window.Extension.Options[name]
                    });
                    break;
                case 'number':
                case 'text':
                default:
                    $(el).val(window.Extension.Options[name]);
                    break;
            }
        });
    };

    $('input[type="checkbox"]').on('change', save_options);
    $('input[type="number"]').on('change', save_options);

    $.each($('label[data-msg^="options_"]'), function (i, item) {
        var msg = $(item).data('msg');
        $(item).html((0, _utils._l)(msg));
    });

    _utils.Device.runtime.getBackgroundPage(function (backgroundPageInstance) {
        window.Extension = backgroundPageInstance.Ext;
        restore_options();

        var homeButton = $('button[data-action="go_to_home"]');

        homeButton.attr({
            title: (0, _utils._l)('action_go_to_home')
        });

        homeButton.on('click', function (e) {
            (0, _utils.openWin)(window.Extension.Options.home_url);
        });

        var feedbackButton = $('button[data-action="go_to_feedback"]');

        feedbackButton.attr({
            title: (0, _utils._l)('action_go_to_feedback')
        });

        feedbackButton.on('click', function (e) {
            (0, _utils.openWin)(window.Extension.Options.feedback_url);
        });

        var feedButton = $('button[data-action="go_to_feed"]');

        feedButton.attr({
            title: (0, _utils._l)('action_go_to_feed')
        });

        feedButton.on('click', function (e) {
            (0, _utils.openWin)(window.Extension.Options.feed_url);
        });

        var newQuestionButton = $('button[data-action="go_to_new_question"]');

        newQuestionButton.attr({
            title: (0, _utils._l)('action_go_to_new_question')
        });

        newQuestionButton.on('click', function (e) {
            (0, _utils.openWin)(window.Extension.Options.new_question_url);
        });
    });
}); /* global Extension, $ */
},{"./utils":2}],2:[function(require,module,exports){
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
},{}]},{},[1]);
