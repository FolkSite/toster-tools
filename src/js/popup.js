function $( selector, parent ) {
    return ( parent || document ).querySelector( selector );
}

function $$( selector, parent ) {
    return ( parent || document ).querySelectorAll( selector );
}


const AJAXCheckbox = $( '#AJAXCheckbox' );
const NotifyCheckbox = $( '#NotifyCheckbox' );
const IntervalInput = $( '#IntervalInput' );
const ToolBarCheckbox = $( '#ToolBarCheckbox' );
const KBDCheckbox = $( '#KBDCheckbox' );
const SaveButton = $( '#save_options' );

function save_options() {
    let opt = {};
    opt.ajax = !!AJAXCheckbox.checked;
    opt.use_notifications = !!NotifyCheckbox.checked;
    opt.interval = parseInt( IntervalInput.value );
    opt.show_toolbar = !!ToolBarCheckbox.checked;
    opt.use_kbd = !!KBDCheckbox.checked;
    window.Options.data = opt;
    window.synchronize();
}

function restore_options() {
    let opt = window.Options.data;
    AJAXCheckbox.checked = !!opt.ajax;
    NotifyCheckbox.checked = !!opt.use_notifications;
    IntervalInput.value = String( opt.interval );
    ToolBarCheckbox.checked = !!opt.show_toolbar;
    KBDCheckbox.checked = !!opt.use_kbd;
}

document.addEventListener( "DOMContentLoaded", function () {
    SaveButton.addEventListener( "click", save_options );

    let items = $$( 'label[data-msg]' );

    for ( let i = 0; i < items.length; i++ ) {
        let item = items[ i ];
        let msg = item.dataset.msg;
        item.innerHTML = chrome.i18n.getMessage( msg );
    }

    SaveButton.innerText = chrome.i18n.getMessage( 'action_save' );

    chrome.runtime.getBackgroundPage( function ( b ) {
        window.Options = b.Options;
        window.synchronize = b.synchronize;
        restore_options();
    } );
} );