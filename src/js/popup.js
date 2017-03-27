(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _utils = require('./utils');

$(document).ready(function () {
    $('label[data-msg="extension_name"]').html((0, _utils._l)('extension_name'));

    var inputs = $('#options_form input[type!="button"]');
    var SaveButton = $('#save_options');

    var save_options = function save_options() {
        $.each(inputs, function (i, el) {
            var name = $(el).attr('id');
            var type = $(el).attr('type');
            if (type === 'checkbox') {
                window.Extension.Options[name] = $(el).prop('checked');
            } else if (type === 'number') {
                window.Extension.Options[name] = parseInt($(el).val(), 10);
            } else if (type === 'text') {
                window.Extension.Options[name] = $(el).val();
            } else {
                window.Extension.Options[name] = $(el).val();
            }
        });
        window.Extension.saveOptions();
    };

    var restore_options = function restore_options() {
        window.Extension.loadOptions();
        $.each(inputs, function (i, el) {
            var name = $(el).attr('id');
            var type = $(el).attr('type');
            if (type === 'checkbox') {
                $(el).prop({
                    checked: window.Extension.Options[name]
                });
            } else if (type === 'number') {
                $(el).val(window.Extension.Options[name]);
            } else if (type === 'text') {
                $(el).val(window.Extension.Options[name]);
            }
        });
    };

    SaveButton.on('click', save_options);
    SaveButton.text((0, _utils._l)('action_save'));

    $.each($('label[data-msg^="options_"]'), function (i, item) {
        var msg = $(item).data('msg');
        $(item).text((0, _utils._l)(msg));
    });

    _utils.Device.runtime.getBackgroundPage(function (backgroundPageInstance) {
        window.Extension = backgroundPageInstance.Ext;
        restore_options();

        var feedButton = $('button[data-action="feed_url"]');
        var newQuestionButton = $('button[data-action="new_question_url"]');

        feedButton.attr({
            title: (0, _utils._l)('action_go_to_website')
        });

        newQuestionButton.attr({
            title: (0, _utils._l)('action_new_question')
        });

        feedButton.on('click', function (e) {
            (0, _utils.openWin)(window.Extension.Options.feed_url);
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
var $ = exports.$ = function $(selector, parent) {
    return (parent || document).querySelector(selector);
};

var $$ = exports.$$ = function $$(selector, parent) {
    return (parent || document).querySelectorAll(selector);
};

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
