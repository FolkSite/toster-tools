// background.js
const Device = browser || chrome;

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
            Device.notifications.create( 'toster.ru', {
                type: 'basic',
                title: Device.i18n.getMessage( 'unread_notifications_title' ),
                iconUrl: 'icon/notify-icon.png',
                message: Device.i18n.getMessage( 'unread_notifications_message', '' + params.count )
            }, id => id );
        }
    }

    sendMessageToContentScript( params ) {
        Device.tabs.query( {}, tabs => {
            for ( let i = 0; i < tabs.length; ++i ) {
                Device.tabs.sendMessage( tabs[ i ].id, params, callbackMessage );
            }
        } );
    }

    synchronize() {
        this.loadOptions();
        if ( !!this.Options.ajax ) {
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

Device.runtime.onMessage.addListener( ( request, sender, callback ) => {
    callbackMessage( request, sender, callback );
} );

Device.notifications.onClosed.addListener( ( notifId, byUser ) => {
    Device.notifications.clear( notifId, ( wasCleared ) => {
        if ( byUser ) {
            Device.tabs.create( {
                url: Ext.Options.tracker_url
            }, tab => tab );
        }
    } );
} );


Ext.synchronize();