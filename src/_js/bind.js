/* global $ */

const use_sign = $( '#bindFirst' ).data( 'use' );
const sign_string = $( '#bindFirst' ).data( 'string' );

$.fn.bindFirst = function ( name, selector, fn ) {
    this.on( name, selector, fn );
    this.each( function () {
        const handlers = $._data( this, 'events' )[ name.split( /\s+/ )[ 0 ] ];
        const lastHandler = handlers.pop();
        handlers.splice( 0, 0, lastHandler );
    } );
};

const formSubmitHandler = function ( event ) {
    if ( use_sign ) {
        const textarea = $( this ).find( 'textarea.textarea' );
        const val = textarea.val();
        if ( val && !val.endsWith( sign_string ) ) {
            textarea.val( `${val}\n${sign_string}` );
        }
    }
};

$( document ).off( 'submit', 'form[data-remote]', formSubmitHandler );
$( document ).bindFirst( 'submit', 'form[data-remote]', formSubmitHandler );
