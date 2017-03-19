const AJAXCheckbox = document.querySelector( '#AJAXCheckbox' );
const IntervalInput = document.querySelector( '#IntervalInput' );
const SaveButton = document.querySelector( '#save_options' );

function save_options() {
    let opt = {};
    opt.interval = parseInt( IntervalInput.value );
    opt.ajax = !!AJAXCheckbox.checked;
    window.Options.data = opt;
    window.synchronize();
}

function restore_options() {
    let opt = window.Options.data;
    IntervalInput.value = String( opt.interval );
    AJAXCheckbox.checked = !!opt.ajax;
}

document.addEventListener( "DOMContentLoaded", function () {
    SaveButton.addEventListener( "click", save_options );

    chrome.runtime.getBackgroundPage( function ( b ) {
        window.Options = b.Options;
        window.synchronize = b.synchronize;
        restore_options();
    } );
} );