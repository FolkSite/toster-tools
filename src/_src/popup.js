/* global Extension, $ */
import {
    Device,
    openWin,
    _l
}
from './utils';

$( document ).ready( () => {
    $( 'label[data-msg="extension_name"]' ).html( _l( 'extension_name' ) );

    const inputs = $( '#options_form input[type!="button"]' );
    const SaveButton = $( '#save_options' );

    const save_options = () => {
        $.each( inputs, ( i, el ) => {
            const name = $( el ).attr( 'id' );
            const type = $( el ).attr( 'type' );
            if ( type === 'checkbox' ) {
                window.Extension.Options[ name ] = $( el ).prop( 'checked' );
            } else if ( type === 'number' ) {
                window.Extension.Options[ name ] = parseInt( $( el ).val(), 10 );
            } else if ( type === 'text' ) {
                window.Extension.Options[ name ] = $( el ).val();
            } else {
                window.Extension.Options[ name ] = $( el ).val();
            }
        } );
        window.Extension.saveOptions();
    };

    const restore_options = () => {
        window.Extension.loadOptions();
        $.each( inputs, ( i, el ) => {
            const name = $( el ).attr( 'id' );
            const type = $( el ).attr( 'type' );
            if ( type === 'checkbox' ) {
                $( el ).prop( {
                    checked: window.Extension.Options[ name ]
                } );
            } else if ( type === 'number' ) {
                $( el ).val( window.Extension.Options[ name ] );
            } else if ( type === 'text' ) {
                $( el ).val( window.Extension.Options[ name ] );
            }
        } );
    };

    SaveButton.on( 'click', save_options );
    SaveButton.text( _l( 'action_save' ) );

    $.each( $( 'label[data-msg^="options_"]' ), ( i, item ) => {
        const msg = $( item ).data( 'msg' );
        $( item ).text( _l( msg ) );
    } );

    Device.runtime.getBackgroundPage( ( backgroundPageInstance ) => {
        window.Extension = backgroundPageInstance.Ext;
        restore_options();

        const feedButton = $( 'button[data-action="feed_url"]' );
        const newQuestionButton = $( 'button[data-action="new_question_url"]' );

        feedButton.attr( {
            title: _l( 'action_go_to_website' )
        } );

        newQuestionButton.attr( {
            title: _l( 'action_new_question' )
        } );

        feedButton.on( 'click', ( e ) => {
            openWin( window.Extension.Options.feed_url );
        } );

        newQuestionButton.on( 'click', ( e ) => {
            openWin( window.Extension.Options.new_question_url );
        } );
    } );
} );
