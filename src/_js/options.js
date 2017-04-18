import $ from 'jquery';

import {
    Device,
    openWin,
    _l
}
from './_modules/utils';


$( document ).ready( () => {
    const inputs = $( '#options_form input[type!="button"]' );
    const selects = $( '#options_form select' );
    const textareas = $( '#options_form textarea' );
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
        $( 'select[id^="sound_"]' ).append( option );
    }

    const setDisabled = ( el, value ) => {
        const fieldset = $( el ).closest( 'fieldset' ).get( 0 );
        if ( fieldset && !value ) {
            $( fieldset ).find( 'input[type!="checkbox"], select, textarea' ).prop( 'disabled', true );
        } else {
            $( fieldset ).find( 'input[type!="checkbox"], select, textarea' ).prop( 'disabled', false );
        }
    };

    const save_options = () => {
        $.each( inputs, ( i, el ) => {
            const name = $( el ).attr( 'id' );
            const type = $( el ).attr( 'type' );
            let value;
            switch ( type ) {
            case 'checkbox':
                value = $( el ).prop( 'checked' );
                setDisabled( el, value );
                break;
            case 'number':
                value = parseInt( $( el ).val(), 10 );
                break;
            case 'text':
            case 'color':
            default:
                value = $( el ).val();
                break;
            }
            window.BG.Ext.Options[ name ] = value;
        } );
        $.each( selects, ( i, el ) => {
            const name = $( el ).attr( 'id' );
            const value = $( el ).val();
            window.BG.Ext.Options[ name ] = value;
        } );
        $.each( textareas, ( i, el ) => {
            const name = $( el ).attr( 'id' );
            const value = $( el ).val();
            window.BG.Ext.Options[ name ] = value;
        } );
        window.BG.Ext.saveOptions();
    };

    const restore_options = () => {
        window.BG.Ext.loadOptions();
        $.each( inputs, ( i, el ) => {
            const name = $( el ).attr( 'id' );
            const type = $( el ).attr( 'type' );
            const value = window.BG.Ext.Options[ name ];
            switch ( type ) {
            case 'checkbox':
                $( el ).prop( {
                    checked: value
                } );
                setDisabled( el, value );
                break;
            case 'number':
            case 'text':
            case 'color':
            default:
                $( el ).val( window.BG.Ext.Options[ name ] );
                break;
            }
        } );
        $.each( selects, ( i, el ) => {
            const name = $( el ).attr( 'id' );
            const value = window.BG.Ext.Options[ name ];
            $( el ).val( value );
        } );
        $.each( textareas, ( i, el ) => {
            const name = $( el ).attr( 'id' );
            const value = window.BG.Ext.Options[ name ];
            $( el ).val( value );
        } );
    };

    $( 'input' ).on( 'change', save_options );
    $( 'select' ).on( 'change', save_options );
    $( 'textarea' ).on( 'change', save_options );

    $.each( $( '[placeholder^="options_"]' ), ( i, item ) => {
        const msg = $( item ).attr( 'placeholder' );
        $( item ).attr( 'placeholder', _l( msg ) );
    } );

    $.each( $( '[data-msg^="options_"]' ), ( i, item ) => {
        const msg = $( item ).data( 'msg' );
        $( item ).html( _l( msg ) );
    } );

    Device.runtime.getBackgroundPage( ( BGInstance ) => {
        window.BG = BGInstance;
        restore_options();
    } );
} );
