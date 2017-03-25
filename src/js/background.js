(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global Device, Ext, browser, chrome */
/* eslint class-methods-use-this: "off" */
/* eslint no-use-before-define: "off" */
const utils = require( '../js/utils' );

const {
    $,
    $$,
    createElement
} = utils;

const Device = ( () => {
    if ( typeof browser === 'undefined' ) {
        return chrome;
    }
    return browser;
} )();

const callbackMessage = ( request, sender, callback ) => {
    window.Ext.callbackMessage( request, sender, callback );
};

class Extension {
    constructor( ...args ) {
        this.Options = {
            ajax: true,
            interval: 10,
            show_toolbar: true,
            use_kbd: true,
            use_notifications: false,
            use_badge_icon: false,
            feed_url: "https://toster.ru/my/feed", // eslint-disable-line
            tracker_url: "https://toster.ru/my/tracker" // eslint-disable-line
        };
    }

    loadOptions() {
        const options = localStorage.getItem( 'options' );

        if ( options ) {
            this.Options = Object.assign( {}, this.Options, JSON.parse( options ) );
        } else {
            this.saveOptions();
        }

        return this.Options;
    }

    saveOptions() {
        localStorage.setItem( 'options', JSON.stringify( this.Options ) );
        this.synchronize();
    }

    getNotifyPage() {
        return fetch( this.Options.tracker_url, {
                credentials: 'include'
            } )
            .then( ( response ) => {
                if ( response.ok ) {
                    return response.text();
                }
                return false;
            } )
            .catch( console.error );
    }

    stopTimer() {
        Device.alarms.clear( 'checkUnread', wasCleared => wasCleared );
    }

    reStartTimer() {
        this.stopTimer();
        this.startTimer();
    }

    checkUnread() {
        this.updateIcon( {
            loading: true
        } );
        this.getNotifyPage().then( ( _body ) => {
            const body = document.createElement( 'div' );
            body.innerHTML = _body;
            const $aside = $( 'aside.layout__navbar[role="navbar"]', body );
            const $event_list = body.querySelector( 'ul.events-list' );
            const $old_event_list = $aside.querySelector( 'ul.events-list' );
            let count = 0;

            try {
                $aside.removeChild( $old_event_list );
            } catch ( e ) {}

            if ( $event_list ) {
                const events_items = $$( 'li', $event_list );

                if ( events_items.length > 3 ) {
                    const text = $event_list.lastElementChild.textContent.replace( /[^\d]/g, '' );
                    count = parseInt( text, 10 );
                } else {
                    count = events_items.length;
                }

                if ( this.Options.use_notifications ) {
                    this.createNotify( {
                        count: count
                    } );
                }
                if ( this.Options.use_badge_icon ) {
                    this.updateIcon( {
                        count: count
                    } );
                }
            } else {
                this.updateIcon( {
                    count: 0
                } );
            }

            $aside.appendChild( $event_list );
        } );
    }

    startTimer() {
        if ( !this.Options.ajax || ( this.Options.interval === 0 ) ) {
            return false;
        }

        Device.alarms.create( 'checkUnread', {
            when: ( Date.now() + ( this.Options.interval * 1000 ) )
        } );
    }

    callbackMessage( request, sender, callback ) {
        this.loadOptions();
        if ( request && request.cmd ) {
            switch ( request.cmd ) {
            case 'options':
            default:
                callback( {
                    cmd: request.cmd,
                    data: this.Options
                } );
                break;
            }
        }
    }

    sendMessageToContentScript( params ) {
        Device.tabs.query( {}, ( tabs ) => {
            for ( let i = 0; i < tabs.length; ++i ) {
                Device.tabs.sendMessage( tabs[ i ].id, params, callbackMessage );
            }
        } );
    }

    createNotify( params ) {
        if ( params && params.count ) {
            Device.notifications.create( 'toster.ru', {
                type: 'basic',
                title: Device.i18n.getMessage( 'unread_notifications_title' ),
                iconUrl: 'icon/notify-icon.png',
                message: Device.i18n.getMessage( 'unread_notifications_message', String( params.count ) )
            }, id => id );
        }
    }

    updateIcon( params ) {
        if ( params && params.count ) {
            Device.browserAction.setBadgeBackgroundColor( {
                color: 'red'
            } );
            Device.browserAction.setBadgeText( {
                text: String( params.count )
            } );
            Device.browserAction.setTitle( {
                title: Device.i18n.getMessage( 'unread_notifications_message', String( params.count ) )
            } );
        } else if ( params && params.loading ) {
            Device.browserAction.setBadgeBackgroundColor( {
                color: 'grey'
            } );
            Device.browserAction.setBadgeText( {
                text: '...'
            } );
        } else {
            Device.browserAction.setBadgeText( {
                text: ''
            } );
            Device.browserAction.setTitle( {
                title: 'Toster'
            } );
        }
    }

    synchronize() {
        this.loadOptions();
        this.reStartTimer();

        if ( this.Options.ajax ) {
            Device.browserAction.setIcon( {
                path: 'icon/icon-64-enabled.png'
            } );
        } else {
            Device.browserAction.setIcon( {
                path: 'icon/icon-64-disabled.png'
            } );
        }

        this.sendMessageToContentScript( {
            cmd: 'options',
            data: this.Options
        } );
    }
}

window.Ext = new Extension();

Device.runtime.onMessage.addListener( callbackMessage );

Device.notifications.onClosed.addListener( ( notifId, byUser ) => {
    Device.notifications.clear( notifId, ( wasCleared ) => {
        if ( byUser ) {
            Device.tabs.create( {
                url: window.Ext.Options.tracker_url
            }, tab => tab );
        }
    } );
} );

Device.notifications.onClicked.addListener( ( notifId ) => {
    Device.notifications.clear( notifId, ( wasCleared ) => {
        if ( wasCleared ) {
            Device.tabs.create( {
                url: window.Ext.Options.tracker_url
            }, tab => tab );
        }
    } );
} );

Device.alarms.onAlarm.addListener( ( alarm ) => {
    switch ( alarm.name ) {
    case 'checkUnread':
        if ( window.Ext.Options.ajax ) {
            window.Ext.checkUnread();
        }
        window.Ext.reStartTimer();
        break;
    default:
        break;
    }
} );


window.Ext.updateIcon();
window.Ext.synchronize();

},{"../js/utils":2}],2:[function(require,module,exports){
function $( selector, parent ) {
    return ( parent || document ).querySelector( selector );
}

function $$( selector, parent ) {
    return ( parent || document ).querySelectorAll( selector );
}

function createElement( str, parent ) {
    const elem = ( parent || document ).createElement( 'div' );
    elem.innerHTML = str;
    if ( elem.childNodes.length > 0 ) {
        return elem.childNodes[ 0 ];
    }
    return elem;
}


module.exports.$ = $;
module.exports.$$ = $$;
module.exports.createElement = createElement;

},{}]},{},[1]);
