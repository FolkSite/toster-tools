(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var isChrome = exports.isChrome = window.chrome && /chrome\//i.test(window.navigator.userAgent);

var isOpera = exports.isOpera = window.opr && window.opr.addons || window.opera || /opr\//i.test(window.navigator.userAgent);

var isFirefox = exports.isFirefox = typeof InstallTrigger !== 'undefined' || /firefox/i.test(window.navigator.userAgent);

var Device = exports.Device = function () {
    if (typeof browser === 'undefined') {
        return chrome;
    }
    return browser;
}();

var getPage = exports.getPage = function getPage(url) {
    return fetch(url, {
        credentials: 'include'
    }).then(function (response) {
        return response.text();
    }).catch(console.error);
};

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
