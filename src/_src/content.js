/* global Device, Ext, browser, chrome */
/* eslint class-methods-use-this: "off" */
/* eslint no-use-before-define: "off" */
import * as utils from './utils';

const Device = utils.Device;

const callbackMessage = ( request, sender, callback ) => {
    window.Ext.callbackMessage( request, sender, callback );
};

class Extension {
    constructor( ...args ) {
        this.Options = {
            show_toolbar: true,
            use_kbd: true,
            hide_top_panel: true,
            hide_right_sidebar: true
        };
    }

    addKeyDownListener() {
        const textareas = utils.$$( 'textarea.textarea' );
        for ( let i = 0; i < textareas.length; i++ ) {
            const textarea = textareas[ i ];
            const form = textarea.form;
            const button = utils.$( 'button[type="submit"]', form );
            textarea.addEventListener( 'keydown', ( event ) => {
                if ( !event ) {
                    const event = window.event;
                }
                if ( ( event.ctrlKey || event.metaKey ) && ( event.keyCode === 13 || event.keyCode === 10 ) ) {
                    if ( this.Options.use_kbd ) {
                        button.click();
                    }
                }
            } );
        }
    }

    switchToolbar() {
        const toolbars = utils.$$( 'div.twpwyg_toolbar' );

        if ( toolbars && toolbars.length ) {
            if ( this.Options.show_toolbar ) {
                for ( let i = 0; i < toolbars.length; i++ ) {
                    toolbars[ i ].classList.remove( 'hidden' );
                }
            } else {
                for ( let i = 0; i < toolbars.length; i++ ) {
                    toolbars[ i ].classList.add( 'hidden' );
                }
            }
        } else {
            if ( !this.Options.show_toolbar ) {
                return;
            }

            const commentForms = utils.$$( 'form.form_comments[role$="comment_form"]' );

            if ( commentForms ) {
                const script = document.createElement( 'script' );
                script.async = true;
                script.src = Device.extension.getURL( 'resources/twpwyg.js' );
                utils.$( 'head' ).appendChild( script );

                const icons_font = document.createElement( 'link' );
                icons_font.rel = 'stylesheet';
                icons_font.href = Device.extension.getURL( 'css/foundation-icons.min.css' );
                utils.$( 'head' ).appendChild( icons_font );

                const toolbar_url = Device.extension.getURL( 'resources/toolbar.html' );

                fetch( toolbar_url, {
                        credentials: 'include'
                    } )
                    .then( response => response.text() )
                    .then( ( body ) => {
                        for ( let i = 0; i < commentForms.length; i++ ) {
                            const form = commentForms[ i ];
                            const field_wrap = utils.$( 'div.field_wrap', form );

                            const div = document.createElement( 'div' );
                            div.appendChild( utils.createElement( body ) );
                            field_wrap.insertBefore( div, field_wrap.firstChild );
                        }
                    } )
                    .catch( console.error );
            }
        }
    }

    updateAnswerList( html ) {

    }

    updateCommentList( html ) {

    }

    updateSidebar( html ) {
        const $aside = utils.$( 'aside.layout__navbar[role="navbar"]' );
        const $event_list = utils.$( 'ul.events-list', $aside );

        try {
            $aside.removeChild( $event_list );
        } catch ( e ) {}

        if ( html ) {
            $aside.insertAdjacentHTML( 'beforeend', html );
        }
    }

    switchTopPanel() {
        const topPanel = utils.$( 'div.tmservices-panel[role="tm_panel"]' );
        if ( this.Options.hide_top_panel ) {
            topPanel.classList.add( 'hidden' );
        } else {
            topPanel.classList.remove( 'hidden' );
        }
    }

    switchRightSidebar() {
        const mainPage = utils.$( 'main.page' );
        if ( this.Options.hide_right_sidebar ) {
            mainPage.style.marginRight = '0px';
        } else {
            mainPage.style.marginRight = '300px';
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
                this.switchToolbar();
                this.addKeyDownListener();
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
