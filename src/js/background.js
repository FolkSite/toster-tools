var browser = browser || chrome;

class Extension {
    constructor( ...args ) {
        this.Options = {
            ajax: true,
            interval: 10,
            show_toolbar: true,
            use_kbd: true,
            use_notifications: false,
            feed_url: "https://toster.ru/my/feed",
            tracker_url: "https://toster.ru/my/tracker"
        };
    }

    loadOptions() {
        let options = localStorage[ "options" ];

        if ( !!options ) {
            this.Options = JSON.parse( options );
        }

        return this.Options;
    }

    saveOptions() {
        localStorage[ "options" ] = JSON.stringify( this.Options );
    }

    createNotify( params ) {
        if ( !!this.Options.use_notifications ) {
            browser.notifications.create( 'toster.ru', {
                type: 'basic',
                title: browser.i18n.getMessage( 'unread_notifications_title' ),
                iconUrl: 'icon/notify-icon.png',
                message: browser.i18n.getMessage( 'unread_notifications_message', '' + params.count )
            }, id => id );
        }
    }

    sendMessageToContentScript( params ) {
        browser.tabs.query( {}, tabs => {
            for ( let i = 0; i < tabs.length; ++i ) {
                browser.tabs.sendMessage( tabs[ i ].id, params, callbackMessage );
            }
        } );
    }

    synchronize() {
        this.loadOptions();
        if ( !!this.Options.ajax ) {
            browser.browserAction.setIcon( {
                path: 'icon/icon-64-enabled.png'
            } );
        } else {
            browser.browserAction.setIcon( {
                path: 'icon/icon-64-disabled.png'
            } );
        }

        this.sendMessageToContentScript( {
            cmd: 'options',
            data: this.Options
        } );
    }
}

var Ext = new Extension();

function callbackMessage( request, sender, callback ) {
    Ext.loadOptions();
    if ( !!request && !!request.cmd ) {
        switch ( request.cmd ) {
        case 'notify':
            Ext.createNotify( request );
            break;
        case 'options':
        default:
            callback( {
                cmd: request.cmd,
                data: Ext.Options
            } );
            break;
        }
    }
}

browser.runtime.onMessage.addListener( ( request, sender, callback ) => {
    callbackMessage( request, sender, callback );
} );

browser.notifications.onClosed.addListener( ( notifId, byUser ) => {
    browser.notifications.clear( notifId, ( wasCleared ) => {
        if ( byUser ) {
            browser.tabs.create( {
                url: Ext.Options.tracker_url
            }, tab => tab );
        }
    } );
} );


Ext.synchronize();