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