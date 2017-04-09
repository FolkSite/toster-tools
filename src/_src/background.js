/* global Ext, $ */
/* eslint class-methods-use-this: "off" */
/* eslint no-use-before-define: "off" */
import {
    Device,
    getPage,
    _l,
    isChrome,
    isOpera,
    isFirefox
}
from './utils';

let useNotificationsFlag = 0;

let feedbackurl;

if ( isChrome && !isOpera ) {
    feedbackurl = 'https://chrome.google.com/webstore/detail/toster-wysiwyg-panel/kpfolongmglpleidinnhnlefeoljdecm/reviews';
} else if ( isOpera ) {
    feedbackurl = 'https://addons.opera.com/extensions/details/toster-wysiwyg-panel/#feedback-container';
} else if ( isFirefox ) {
    feedbackurl = 'https://addons.mozilla.org/firefox/addon/toster-wysiwyg-panel/#reviews';
}

const extensionHomeUrl = 'https://github.com/yarkovaleksei/toster-wysiwyg-panel';

const installHandler = ( details ) => {
    if ( Device.runtime.setUninstallURL && feedbackurl ) {
        Device.runtime.setUninstallURL( feedbackurl );
    }
    const currentVersion = Device.runtime.getManifest().version;
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

const alarmHandler = ( alarm ) => {
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
};

const callbackMessage = ( request, sender, callback ) => {
    window.Ext.callbackMessage( request, sender, callback );
};

class Extension {
    constructor( ...args ) {
        this.defaults = Object.freeze( {
            ajax: true,
            check_answers: false,
            check_feed: true,
            interval: 10,
            use_sound: true,
            name_sound: 'sound/sound1.ogg',
            use_kbd: true,
            use_tab: false,
            use_notifications: false,
            use_badge_icon: true,
            hide_top_panel: false,
            hide_right_sidebar: false,
            home_url: extensionHomeUrl,
            feedback_url: feedbackurl || extensionHomeUrl,
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

    saveOptions( options ) {
        localStorage.setItem( 'options', JSON.stringify( options || this.Options ) );
        this.synchronize();
    }

    checkUnread() {
        this.updateIcon( {
            loading: true
        } );
        getPage( this.Options.tracker_url ).then( ( body ) => {
            let event_list = $( body ).find( 'ul.events-list' )[ 0 ];
            let count = 0;
            let events_items;

            if ( $( event_list ) ) {
                events_items = $( event_list ).find( 'li' );

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

            event_list = null;
            events_items = null;
            body = null;
        } );
    }

    stopTimer() {
        Device.alarms.clear( 'checkUnread', wasCleared => wasCleared );
    }

    reStartTimer() {
        this.stopTimer();
        this.startTimer();
    }

    startTimer() {
        if ( !this.Options.ajax || ( this.Options.interval < 1 ) ) {
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

window.Ext.updateIcon();
window.Ext.synchronize();

if ( isChrome ) {
    Device.notifications.onClicked.addListener( ( notifId ) => {
        Device.notifications.clear( notifId, ( wasCleared ) => {
            Device.tabs.create( {
                url: window.Ext.Options.tracker_url
            }, tab => tab );
        } );
    } );
} else {
    Device.notifications.onClosed.addListener( ( notifId, byUser ) => {
        Device.notifications.clear( notifId, ( wasCleared ) => {
            if ( byUser ) {
                Device.tabs.create( {
                    url: window.Ext.Options.tracker_url
                }, tab => tab );
            }
        } );
    } );
}

Device.runtime.onMessage.addListener( callbackMessage );

Device.alarms.onAlarm.addListener( alarmHandler );

Device.runtime.onInstalled.addListener( installHandler );
