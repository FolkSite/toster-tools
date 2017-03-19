// background.js

var Options = {
    default: {
        ajax: true,
        interval: 10
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

function callbackMessage( request, sender, callback ) {
    if ( !!request && !!request.cmd ) {
        if ( request.cmd === 'options' ) {
            callback( {
                cmd: 'options',
                data: Options.data
            } );
        } else {
            callback( {
                cmd: 'options',
                data: {}
            } );
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
        chrome.browserAction.setTitle( {
            title: 'TWP enabled'
        } );
    } else {
        chrome.browserAction.setIcon( {
            path: 'icon/icon-64-disabled.png'
        } );
        chrome.browserAction.setTitle( {
            title: 'TWP disabled'
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


synchronize();