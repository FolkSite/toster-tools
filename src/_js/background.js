import $ from 'jquery';

import Timer from './_modules/timer';

import {
    Device,
    getPage,
    _l,
    isChrome,
    isOpera,
    isFirefox
}
from './_modules/utils';

let feedbackurl;

if ( isChrome && !isOpera ) {
    feedbackurl = 'https://chrome.google.com/webstore/detail/toster-tools/kpfolongmglpleidinnhnlefeoljdecm/reviews';
} else if ( isOpera ) {
    feedbackurl = 'https://addons.opera.com/extensions/details/toster-wysiwyg-panel/#feedback-container';
} else if ( isFirefox ) {
    feedbackurl = 'https://addons.mozilla.org/firefox/addon/toster-tools/#reviews';
}

const extensionHomeUrl = 'https://github.com/yarkovaleksei/toster-tools';

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
        if ( window.Ext.Options.check_notify && window.navigator.onLine ) {
            window.Ext.checkNotify();
        }
        window.Ext.reStartTimer();
        break;
    default:
        break;
    }
};

const callbackMessage = ( ...args ) => window.Ext.callbackMessage( ...args );

class Extension {
    constructor( ...args ) {
        this.defaults = Object.freeze( {
            check_notify: true,
            check_answers: false,
            check_feed: true,
            interval_notify: 10,
            interval_answers: 10,
            interval_feed: 10,
            use_sound: true,
            sound_notify: 'sound/sound1.ogg',
            sound_answers: 'sound/sound2.ogg',
            sound_feed: 'sound/sound3.ogg',
            use_kbd: true,
            use_tab: true,
            use_notifications: false,
            use_badge_icon: true,
            hide_top_panel: false,
            hide_right_sidebar: false,
            monospace_textarea: false,
            monospace_code: false,
            use_sign: false,
            sign_string: `- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n${Device.runtime.getManifest().name}`,
            home_url: extensionHomeUrl,
            feedback_url: feedbackurl,
            allowDomain: 'https://toster.ru',
            feed_url: 'https://toster.ru/my/feed',
            tracker_url: 'https://toster.ru/my/tracker',
            new_question_url: 'https://toster.ru/question/new',
            feed_border_color: '#8c9480'
        } );
        this.Options = Object.assign( {}, this.defaults );
        this.useNotificationsFlag = 0;
        this.Timer = new Timer( 'checkUnread', this.Options.interval_notify );
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

    checkNotify() {
        this.updateIcon( {
            loading: true
        } );

        window.promise = getPage( this.Options.tracker_url );
        window.promise.then( ( body ) => {
                let count = 0;
                const event_list = $( body ).find( 'ul.events-list' )[ 0 ];

                if ( $( event_list ) ) {
                    const events_items = $( event_list ).find( 'li' );

                    if ( events_items.length > 3 ) {
                        const text = $( events_items ).last().text().replace( /[^\d]/g, '' );
                        count = parseInt( text, 10 );
                    } else {
                        count = events_items.length;
                    }

                    if ( this.Options.use_notifications && this.useNotificationsFlag === 0 ) {
                        this.createNotify( {
                            count: count
                        } );
                    }

                    if ( this.Options.use_badge_icon ) {
                        this.updateIcon( {
                            count: count
                        } );
                    }

                    this.useNotificationsFlag = count;

                    this.sendMessageToContentScript( {
                        cmd: 'updateSidebar',
                        data: ( $( event_list )[ 0 ] || {} ).outerHTML || ''
                    } );
                } else {
                    this.updateIcon( {
                        count: 0
                    } );
                    this.useNotificationsFlag = 0;
                }

                $( body ).empty();
                body = null;
                return Promise.resolve();
            } )
            .then( () => ( window.promise = null ) );
    }

    stopTimer() {
        this.Timer.stop( name => ( window.promise = null ) );
    }

    reStartTimer() {
        this.stopTimer();
        this.startTimer();
    }

    startTimer() {
        if ( !this.Options.check_notify || ( this.Options.interval_notify < 1 ) ) {
            return false;
        }

        this.Timer.setInterval( this.Options.interval_notify );
        this.Timer.start( name => ( window.promise = null ) );
    }

    allTabs() {
        const tabs = new Promise( ( resolve, reject ) => {
            const tabsArray = [];
            Device.tabs.query( {}, ( tabs ) => {
                for ( const tab of tabs ) {
                    if ( tab && tab.id && tab.url && tab.url.startsWith( this.Options.allowDomain ) ) {
                        tabsArray.push( tab );
                    }
                }
                resolve( tabsArray );
            } );
        } );
        return tabs;
    }

    callbackMessage( request, sender, callback ) {
        this.loadOptions();
        if ( request && request.cmd ) {
            switch ( request.cmd ) {
            case 'execute':
                this.allTabs().then( ( tabs ) => {
                    for ( const tab of tabs ) {
                        Device.tabs.executeScript( tab.id, {
                            code: request.code,
                            allFrames: false,
                            runAt: 'document_end'
                        }, result => console.log( result ) );
                    }
                } );
                break;
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
        let backgroundColor = '#5e5656';
        let badgeText = '...';
        let badgeTitle = _l( 'extension_name' );

        if ( params && params.count ) {
            backgroundColor = '#ff0000';
            badgeText = String( params.count );
            badgeTitle = _l( 'unread_notifications_message', [ String( params.count ) ] );

            Device.browserAction.setBadgeBackgroundColor( {
                color: backgroundColor
            } );
            Device.browserAction.setBadgeText( {
                text: badgeText
            } );
            Device.browserAction.setTitle( {
                title: badgeTitle
            } );
        } else if ( params && params.loading ) {
            Device.browserAction.setBadgeBackgroundColor( {
                color: backgroundColor
            } );
            Device.browserAction.setBadgeText( {
                text: badgeText
            } );
        } else {
            badgeText = '';
            Device.browserAction.setBadgeText( {
                text: badgeText
            } );
            Device.browserAction.setTitle( {
                title: badgeTitle
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

    sendMessageToContentScript( params ) {
        this.allTabs().then( ( tabs ) => {
            for ( const tab of tabs ) {
                Device.tabs.sendMessage( tab.id, params, callbackMessage );
            }
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
