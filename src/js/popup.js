(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function $( selector, parent ) {
    return ( parent || document ).querySelector( selector );
}

function $$( selector, parent ) {
    return ( parent || document ).querySelectorAll( selector );
}

function createElement( str, parent ) {
    const elem = ( parent || document ).createElement( 'div' );
    elem.innerHTML = str;
    if ( elem.childNodes.length > 0 ) {
        return elem.childNodes[ 0 ];
    }
    return elem;
}


module.exports.$ = $;
module.exports.$$ = $$;
module.exports.createElement = createElement;

},{}],2:[function(require,module,exports){
/* global Device, Extension, browser, chrome */
const utils = require( '../js/utils' );

const {
    $,
    $$
} = utils;

const Device = ( () => {
    if ( typeof browser === 'undefined' ) {
        return chrome;
    }
    return browser;
} )();

const AJAXCheckbox = $( '#AJAXCheckbox' );
const BadgeCheckbox = $( '#BadgeCheckbox' );
const NotifyCheckbox = $( '#NotifyCheckbox' );
const IntervalInput = $( '#IntervalInput' );
const ToolBarCheckbox = $( '#ToolBarCheckbox' );
const KBDCheckbox = $( '#KBDCheckbox' );
const SaveButton = $( '#save_options' );

const save_options = () => {
    const opt = {};
    opt.ajax = !!AJAXCheckbox.checked;
    opt.use_notifications = !!NotifyCheckbox.checked;
    opt.use_badge_icon = !!BadgeCheckbox.checked;
    opt.interval = parseInt( IntervalInput.value, 10 );
    opt.show_toolbar = !!ToolBarCheckbox.checked;
    opt.use_kbd = !!KBDCheckbox.checked;
    window.Extension.Options = Object.assign( {}, window.Extension.Options, opt );
    window.Extension.saveOptions();
};

const restore_options = () => {
    window.Extension.loadOptions();
    const opt = window.Extension.Options;
    AJAXCheckbox.checked = !!opt.ajax;
    NotifyCheckbox.checked = !!opt.use_notifications;
    BadgeCheckbox.checked = !!opt.use_badge_icon;
    IntervalInput.value = String( opt.interval );
    ToolBarCheckbox.checked = !!opt.show_toolbar;
    KBDCheckbox.checked = !!opt.use_kbd;
};

document.addEventListener( 'DOMContentLoaded', () => {
    SaveButton.addEventListener( 'click', save_options );

    const items = $$( 'label[data-msg]' );

    for ( let i = 0; i < items.length; i++ ) {
        const item = items[ i ];
        const msg = item.dataset.msg;
        item.innerHTML = Device.i18n.getMessage( msg );
    }

    SaveButton.innerText = Device.i18n.getMessage( 'action_save' );

    Device.runtime.getBackgroundPage( ( backgroundPageInstance ) => {
        window.Extension = backgroundPageInstance.Ext;
        restore_options();

        const tracker_label = $( 'label[data-msg="tracker_url"]' );
        tracker_label.innerHTML = Device.i18n.getMessage( 'tracker_url', [ window.Extension.Options.tracker_url, Device.i18n.getMessage( 'action_go_to_website' ) ] );
    } );
} );

},{"../js/utils":1}]},{},[2]);
