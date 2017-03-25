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
