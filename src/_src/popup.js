/* global Extension, $ */
import {
    Device,
    openWin,
    _l
}
from './utils';

$( document ).ready( () => {
    const inputs = $( '#options_form input[type!="button"]' );
    const selects = $( '#options_form select' );
    const Manifest = Device.runtime.getManifest();
    const sounds = Manifest.web_accessible_resources.filter( ( item ) => {
        if ( item.endsWith( '.ogg' ) ) {
            return item;
        }
        return false;
    } );

    for ( let i = 0; i < sounds.length; i++ ) {
        const option = $( '<option/>', {
            value: sounds[ i ]
        } );
        option.text( sounds[ i ].split( '/' )[ 1 ] );
        $( '#name_sound' ).append( option );
    }

    const save_options = () => {
        $.each( inputs, ( i, el ) => {
            const name = $( el ).attr( 'id' );
            const type = $( el ).attr( 'type' );
            let value;
            switch ( type ) {
            case 'checkbox':
                value = $( el ).prop( 'checked' );
                break;
            case 'number':
                value = parseInt( $( el ).val(), 10 );
                break;
            case 'text':
            default:
                value = $( el ).val();
                break;
            }
            window.Extension.Options[ name ] = value;
        } );
        $.each( selects, ( i, el ) => {
            const name = $( el ).attr( 'id' );
            const value = $( el ).val();
            window.Extension.Options[ name ] = value;
        } );
        window.Extension.saveOptions();
    };

    const restore_options = () => {
        window.Extension.loadOptions();
        $.each( inputs, ( i, el ) => {
            const name = $( el ).attr( 'id' );
            const type = $( el ).attr( 'type' );
            switch ( type ) {
            case 'checkbox':
                $( el ).prop( {
                    checked: window.Extension.Options[ name ]
                } );
                break;
            case 'number':
            case 'text':
            default:
                $( el ).val( window.Extension.Options[ name ] );
                break;
            }
        } );
        $.each( selects, ( i, el ) => {
            const name = $( el ).attr( 'id' );
            const value = window.Extension.Options[ name ];
            $( el ).val( value );
        } );
    };

    $( 'input[type="checkbox"]' ).on( 'change', save_options );
    $( 'input[type="number"]' ).on( 'change', save_options );
    $( 'select' ).on( 'change', save_options );

    $.each( $( 'label[data-msg^="options_"]' ), ( i, item ) => {
        const msg = $( item ).data( 'msg' );
        $( item ).html( _l( msg ) );
    } );

    Device.runtime.getBackgroundPage( ( backgroundPageInstance ) => {
        window.Extension = backgroundPageInstance.Ext;
        restore_options();

        const homeButton = $( 'button[data-action="go_to_home"]' );

        homeButton.attr( {
            title: _l( 'action_go_to_home' )
        } );

        homeButton.on( 'click', ( e ) => {
            openWin( window.Extension.Options.home_url );
        } );

        const feedbackButton = $( 'button[data-action="go_to_feedback"]' );

        feedbackButton.attr( {
            title: _l( 'action_go_to_feedback' )
        } );

        feedbackButton.on( 'click', ( e ) => {
            openWin( window.Extension.Options.feedback_url );
        } );

        const feedButton = $( 'button[data-action="go_to_feed"]' );

        feedButton.attr( {
            title: _l( 'action_go_to_feed' )
        } );

        feedButton.on( 'click', ( e ) => {
            openWin( window.Extension.Options.feed_url );
        } );

        const newQuestionButton = $( 'button[data-action="go_to_new_question"]' );

        newQuestionButton.attr( {
            title: _l( 'action_go_to_new_question' )
        } );

        newQuestionButton.on( 'click', ( e ) => {
            openWin( window.Extension.Options.new_question_url );
        } );
    } );
} );
