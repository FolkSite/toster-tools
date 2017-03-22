(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function $( selector, parent ) {
    return ( parent || document ).querySelector( selector );
}

function $$( selector, parent ) {
    return ( parent || document ).querySelectorAll( selector );
}

function createElement( str, parent ) {
    let elem = ( parent || document ).createElement( 'div' );
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
const utils = require( '../js/utils' );

var browser = browser || chrome;

const {
    $,
    $$,
    createElement
} = utils;

const AJAXCheckbox = $( '#AJAXCheckbox' );
const NotifyCheckbox = $( '#NotifyCheckbox' );
const IntervalInput = $( '#IntervalInput' );
const ToolBarCheckbox = $( '#ToolBarCheckbox' );
const KBDCheckbox = $( '#KBDCheckbox' );
const SaveButton = $( '#save_options' );

const save_options = () => {
    let opt = {};
    opt.ajax = !!AJAXCheckbox.checked;
    opt.use_notifications = !!NotifyCheckbox.checked;
    opt.interval = parseInt( IntervalInput.value );
    opt.show_toolbar = !!ToolBarCheckbox.checked;
    opt.use_kbd = !!KBDCheckbox.checked;
    Extension.Options = opt;
    Extension.saveOptions();
    Extension.synchronize();
}

const restore_options = () => {
    Extension.loadOptions();
    let opt = Extension.Options;
    AJAXCheckbox.checked = !!opt.ajax;
    NotifyCheckbox.checked = !!opt.use_notifications;
    IntervalInput.value = String( opt.interval );
    ToolBarCheckbox.checked = !!opt.show_toolbar;
    KBDCheckbox.checked = !!opt.use_kbd;
}

document.addEventListener( 'DOMContentLoaded', () => {
    SaveButton.addEventListener( 'click', save_options );

    let items = $$( 'label[data-msg]' );

    for ( let i = 0; i < items.length; i++ ) {
        let item = items[ i ];
        let msg = item.dataset.msg;
        item.innerHTML = browser.i18n.getMessage( msg );
    }

    SaveButton.innerText = browser.i18n.getMessage( 'action_save' );

    browser.runtime.getBackgroundPage( backgroundPageInstance => {
        window.Extension = backgroundPageInstance.Ext;
        restore_options();
    } );
} );
},{"../js/utils":1}]},{},[2]);
