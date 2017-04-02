/* global Ext, $ */
/* eslint class-methods-use-this: "off" */
/* eslint no-use-before-define: "off" */
import {
    Device,
    _l,
    isChrome,
    isOpera,
    isFirefox
}
from './utils';

let useNotificationsFlag = 0;
const chromeUninstallUrl = 'https://chrome.google.com/webstore/detail/toster-wysiwyg-panel/kpfolongmglpleidinnhnlefeoljdecm/reviews';
const operaUninstallUrl = 'https://addons.opera.com/extensions/details/toster-wysiwyg-panel/#feedback-container';
const ffUninstallUrl = 'https://addons.mozilla.org/firefox/addon/toster-wysiwyg-panel';

let uninstallurl;
if ( isChrome && !isOpera ) {
    uninstallurl = chromeUninstallUrl;
} else if ( isOpera ) {
    uninstallurl = operaUninstallUrl;
} else if ( isFirefox ) {
    uninstallurl = ffUninstallUrl;
}

const installHandler = ( details ) => {
    const currentVersion = Device.runtime.getManifest().version;
    window.Ext.updateIcon();
    window.Ext.synchronize();
    switch ( details.reason ) {
    case 'update':
        // console.log( `Updated from ${details.previousVersion} to ${currentVersion}!` );
        break;
    case 'install':
    default:
        // console.log( 'Extension installed!' );
        break;
    }
};

const callbackMessage = ( request, sender, callback ) => {
    window.Ext.callbackMessage( request, sender, callback );
};

class Extension {
    constructor( ...args ) {
        this.defaults = Object.freeze( {
            home_url: 'https://github.com/yarkovaleksei/toster-wysiwyg-panel',
            feedback_url: uninstallurl,
            ajax: true,
            interval: 10,
            use_kbd: true,
            use_tab: true,
            use_notifications: false,
            use_badge_icon: true,
            hide_top_panel: true,
            hide_right_sidebar: true,
            feed_url: 'https://toster.ru/my/feed',
            tracker_url: 'https://toster.ru/my/tracker',
            new_question_url: 'https://toster.ru/question/new'
        } );
        this.Options = Object.assign( {}, this.defaults );
    }

    loadOptions() {
        const options = localStorage.getItem( 'options' );

        if ( options ) {
            this.Options = Object.assign( {}, this.defaults, JSON.parse( options ) );
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
        this.updateIcon( {
            loading: true
        } );
        return fetch( this.Options.tracker_url, {
                credentials: 'include'
            } )
            .then( response => response.text() )
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
        this.getNotifyPage().then( ( body ) => {
            const event_list = $( body ).find( 'ul.events-list' )[ 0 ];
            let count = 0;

            if ( $( event_list ) ) {
                const events_items = $( event_list ).find( 'li' );

                if ( events_items.length > 3 ) {
                    const text = $( events_items ).last().text().replace( /[^\d]/g, '' );
                    count = parseInt( text, 10 );
                } else {
                    count = events_items.length;
                }

                if ( this.Options.use_notifications && useNotificationsFlag === 0 ) {
                    this.createNotify( {
                        count: count
                    } );
                }

                if ( this.Options.use_badge_icon ) {
                    this.updateIcon( {
                        count: count
                    } );
                }

                useNotificationsFlag = count;

                this.sendMessageToContentScript( {
                    cmd: 'updateSidebar',
                    data: $( event_list )[ 0 ].outerHTML || ''
                } );
            } else {
                this.updateIcon( {
                    count: 0
                } );
                useNotificationsFlag = 0;
            }
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
        if ( params && params.count > 0 ) {
            Device.notifications.create( 'toster.ru', {
                type: 'basic',
                title: _l( 'unread_notifications_title' ),
                iconUrl: 'icon/svg/alarm.svg',
                message: _l( 'unread_notifications_message', [ String( params.count ) ] )
            }, id => id );
        }
    }

    updateIcon( params ) {
        if ( params && params.count ) {
            Device.browserAction.setBadgeBackgroundColor( {
                color: '#ff0000'
            } );
            Device.browserAction.setBadgeText( {
                text: String( params.count )
            } );
            Device.browserAction.setTitle( {
                title: _l( 'unread_notifications_message', [ String( params.count ) ] )
            } );
        } else if ( params && params.loading ) {
            Device.browserAction.setBadgeBackgroundColor( {
                color: '#5e5656'
            } );
            Device.browserAction.setBadgeText( {
                text: '...'
            } );
        } else {
            Device.browserAction.setBadgeText( {
                text: ''
            } );
            Device.browserAction.setTitle( {
                title: _l( 'extension_name' )
            } );
        }
    }

    synchronize() {
        this.loadOptions();
        this.reStartTimer();
        this.sendMessageToContentScript( {
            cmd: 'options',
            data: this.Options
        } );
    }
}

window.Ext = new Extension();

Device.runtime.setUninstallURL( uninstallurl );

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

Device.alarms.onAlarm.addListener( ( alarm ) => {
    switch ( alarm.name ) {
    case 'checkUnread':
        if ( window.Ext.Options.ajax && window.navigator.onLine ) {
            window.Ext.checkUnread();
        }
        window.Ext.reStartTimer();
        break;
    default:
        break;
    }
} );

Device.runtime.onInstalled.addListener( installHandler );
