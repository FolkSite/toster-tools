// background.js

var Options = {
    default: {
        ajax: true,
        interval: 10,
        show_toolbar: true,
        use_kbd: true,
        use_notifications: false,
        feed_url: "https://toster.ru/my/feed",
        tracker_url: "https://toster.ru/my/tracker"
    },

    get data() {
        let _options = localStorage[ "options" ];

        if ( !!_options ) {
            let json = JSON.parse( _options );
            json.interval = ( json.interval >= 1000 ) ? ( json.interval / 1000 ) : json.interval;
            return json;
        }

        _options = JSON.stringify( Options.default );
        localStorage[ "options" ] = _options;
        return JSON.parse( _options );
    },

    set data( options ) {
        let _opt = options || Options.default;
        _opt.interval = ( _opt.interval * 1000 );
        localStorage[ "options" ] = JSON.stringify( Object.assign( {}, Options.default, _opt ) );
    }
};

function createNotify( params ) {
    if ( !!Options.data.use_notifications ) {
        chrome.notifications.create( 'toster.ru', {
            type: 'basic',
            title: chrome.i18n.getMessage( 'unread_notifications_title' ),
            iconUrl: 'icon/notify-icon.png',
            message: chrome.i18n.getMessage( 'unread_notifications_message', '' + params.count ),
            requireInteraction: true
        }, function ( id ) {

        } );
    }
}

function callbackMessage( request, sender, callback ) {
    if ( !!request && !!request.cmd ) {
        switch ( request.cmd ) {
        case 'options':
            callback( {
                cmd: request.cmd,
                data: Options.data
            } );
            break;
        case 'notify':
            createNotify( request );
            callback( {
                cmd: request.cmd,
                data: Options.data
            } );
            break;
        default:
            callback( {
                cmd: request.cmd,
                data: Options.data
            } );
            break;
        }
    }
}

function sendMessageToContentScript( params ) {
    chrome.tabs.query( {}, function ( tabs ) {
        for ( let i = 0; i < tabs.length; ++i ) {
            chrome.tabs.sendMessage( tabs[ i ].id, params, callbackMessage );
        }
    } );
}

function synchronize() {
    if ( !!Options.data.ajax ) {
        chrome.browserAction.setIcon( {
            path: 'icon/icon-64-enabled.png'
        } );
    } else {
        chrome.browserAction.setIcon( {
            path: 'icon/icon-64-disabled.png'
        } );
    }

    let message = {
        cmd: 'options',
        data: Options.data
    };
    sendMessageToContentScript( message );
}

chrome.extension.onMessage.addListener( ( request, sender, callback ) => {
    callbackMessage( request, sender, callback );
} );

chrome.notifications.onClosed.addListener( function ( notifId, byUser ) {
    chrome.notifications.clear( notifId, ( wasCleared ) => {
        if ( byUser ) {
            chrome.tabs.create( {
                url: Options.data.tracker_url
            }, function ( tab ) {} );
        }
    } );
} );


synchronize();