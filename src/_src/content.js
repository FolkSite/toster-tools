/* global Ext, $ */
/* eslint class-methods-use-this: "off" */
/* eslint no-use-before-define: "off" */
/* eslint no-useless-escape: "off" */
/* eslint no-control-regex: "off" */
import {
    Device
} from './utils';

HTMLTextAreaElement.prototype.setCaretPosition = function ( start, end ) {
    end = typeof end !== 'undefined' ? end : start;
    this.selectionStart = start;
    this.selectionEnd = end;
    this.focus();
};

HTMLTextAreaElement.prototype.hasSelection = function () {
    if ( this.selectionStart === this.selectionEnd ) {
        return false;
    }
    return true;
};

HTMLTextAreaElement.prototype.isMultilineSelection = function () {
    const re = /(\n)/g;
    if ( ( this.value.substring( this.selectionStart, this.selectionEnd ).match( re ) || [] ).length > 0 ) {
        return true;
    }
    return false;
};

const callbackMessage = ( request, sender, callback ) => {
    window.Ext.callbackMessage( request, sender, callback );
};

class Extension {
    constructor( ...args ) {
        this.defaults = Object.freeze( {
            use_kbd: true,
            use_tab: true,
            hide_top_panel: false,
            hide_right_sidebar: false
        } );
        this.Options = Object.assign( {}, this.defaults );
        this.textareaSelectorAll = 'textarea.textarea';
    }

    addKeyDownSendListener() {
        $( document ).delegate( this.textareaSelectorAll, 'keydown', ( event ) => {
            if ( !event ) {
                const event = window.event;
            }
            const form = $( event.target.form );
            const button = $( 'button[type="submit"]', form );
            if ( ( event.ctrlKey || event.metaKey ) && ( event.keyCode === 13 || event.keyCode === 10 ) ) {
                if ( this.Options.use_kbd ) {
                    button.click();
                }
            }
        } );
    }

    addKeyDownIndentFormatListener() {
        $( document ).delegate( this.textareaSelectorAll, 'keydown', ( event ) => {
            if ( !event ) {
                const event = window.event;
            }

            if ( event.keyCode !== 9 || ( event.ctrlKey || event.metaKey ) || event.altKey ) return;

            if ( !this.Options.use_tab ) return false;

            const tabString = '\t';
            const target = event.target;
            const selectionStart = target.selectionStart;
            const selectionEnd = target.selectionEnd;

            let lineStart = selectionStart;
            for ( lineStart = selectionStart; lineStart >= 0 && target.value[ lineStart ] !== '\n'; lineStart-- );

            let lineEnd = selectionEnd;
            for ( lineEnd = selectionEnd; lineEnd < target.value.length && target.value[ lineEnd ] !== '\n'; lineEnd++ );


            let text = target.value.substring( lineStart, lineEnd );

            // Are we selecting multiple lines?
            if ( target.hasSelection() && target.isMultilineSelection() ) {
                let numChanges = 0;
                let firstLineNumChanges = 1;

                if ( !event.shiftKey ) { // Normal Tab
                    const re = new RegExp( '(\n[ ]*)', 'g' );

                    numChanges = ( text.match( re ) || [] ).length;

                    text = text.replace( re, `\$1${tabString}` );
                } else { // Shift+Tab
                    const re = new RegExp( `(\n[ ]*)${tabString}`, 'g' );

                    numChanges = ( text.match( re ) || [] ).length;

                    let indexOfNewLine = 1;
                    for ( indexOfNewLine = 1; indexOfNewLine < text.length && text[ indexOfNewLine ] !== '\n'; ++indexOfNewLine );
                    firstLineNumChanges = ( text.substring( 0, indexOfNewLine ).match( re ) || [] ).length;

                    text = text.replace( re, '$1' );
                }


                target.value = target.value.substring( 0, lineStart ) + text + target.value.substring( lineEnd, target.value.length );

                // Keep the selection we had before
                const newSelectionStart = ( selectionStart + ( tabString.length * ( ( !event.shiftKey ) ? 1 : -1 ) ) * firstLineNumChanges );
                const newSelectionEnd = selectionEnd + ( ( tabString.length * numChanges * ( ( !event.shiftKey ) ? 1 : -1 ) ) );


                target.setCaretPosition( newSelectionStart, newSelectionEnd );
            } else {
                // We are not in multiline so
                // we should add a tab at the position
                // only shift-tab if there is a tab present before
                if ( !event.shiftKey ) { // Normal Tab
                    target.value = target.value.substring( 0, selectionStart ) + tabString + target.value.substring( selectionEnd, target.value.length );

                    target.setCaretPosition( selectionStart + tabString.length, selectionEnd + tabString.length );
                } else if ( target.value.substring( selectionStart - tabString.length, selectionStart ) === tabString ) { // Shift+Tab
                    target.value = target.value.substring( 0, selectionStart - tabString.length ) + target.value.substring( selectionEnd, target.value.length );
                    target.setCaretPosition( selectionStart - tabString.length, selectionEnd - tabString.length );
                }
            }
            return false;
        } );
    }

    updateAnswerList( html ) {

    }

    updateCommentList( html ) {

    }

    updateSidebar( html ) {
        const aside = $( 'aside.layout__navbar[role="navbar"]' );

        try {
            aside.children( 'ul.events-list' ).remove();
        } catch ( e ) {}

        if ( html ) {
            aside.append( $( html ) );
        }
    }

    switchTopPanel() {
        const topPanel = $( 'div.tmservices-panel[role="tm_panel"]' );

        if ( this.Options.hide_top_panel ) {
            topPanel.hide();
        } else {
            topPanel.show();
        }
    }

    switchRightSidebar() {
        const mainPage = $( 'main.page' );

        if ( this.Options.hide_right_sidebar ) {
            $( 'div.dropdown__menu' ).css( {
                left: '-150px'
            } );
            mainPage.css( {
                marginRight: '0px'
            } );
        } else {
            $( 'div.dropdown__menu' ).css( {
                left: '0px'
            } );
            mainPage.css( {
                marginRight: '300px'
            } );
        }
    }

    callbackMessage( request, sender, callback ) {
        if ( request && request.cmd ) {
            switch ( request.cmd ) {
            case 'updateAnswerList':
                // this.updateAnswerList(request.data);
                break;
            case 'updateCommentList':
                // this.updateCommentList(request.data);
                break;
            case 'updateSidebar':
                this.updateSidebar( request.data );
                break;
            case 'options':
            default:
                this.Options = Object.assign( {}, this.Options, request.data || {} );
                this.switchTopPanel();
                this.switchRightSidebar();
                this.addKeyDownSendListener();
                this.addKeyDownIndentFormatListener();
                break;
            }
        }
    }

    sendMessageToBackgroundScript( request ) {
        Device.runtime.sendMessage( request, {}, callbackMessage );
    }
}

window.Ext = new Extension();

Device.runtime.onMessage.addListener( callbackMessage );

window.Ext.sendMessageToBackgroundScript( {
    cmd: 'options'
} );
