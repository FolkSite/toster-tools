/**
 * @description Extension utils module
 * @module _modules/utils
 */

export const Device = ( () => {
    if ( typeof browser === 'undefined' ) {
        return chrome;
    }
    return browser;
} )();

/**
 * True if the Google Chrome browser is true
 */
export const isChrome = ( window.chrome && /chrome\//i.test( window.navigator.userAgent ) );

/**
 * True if the Opera browser is true
 */
export const isOpera = ( ( ( window.opr && window.opr.addons ) || window.opera ) || /opr\//i.test( window.navigator.userAgent ) );

/**
 * True if the Firefox browser is true
 */
export const isFirefox = ( ( typeof InstallTrigger !== 'undefined' ) || /firefox/i.test( window.navigator.userAgent ) );

/**
 * This is wrapper of chrome.i18n.getMessage
 *
 * @param   {String}  msg  Phrase ID
 * @param   {Array}  [placeholders=[]]  Array of placeholders. See {@link https://developer.chrome.com/extensions/i18n|documentation}
 *
 * @return  {String}  Locale phrase
 */
export const _l = ( msg, placeholders = [] ) => Device.i18n.getMessage( msg, placeholders );

/**
 * This is wrapper of window.open
 *
 * @param   {String}  url  Page URL
 */
export const openWin = url => window.open( url, 'wName' );

/**
 * This is wrapper of window.fetch
 *
 * @param   {String}  url  Page URL
 * @param   {String}  [method="GET"]  Request method
 * @param   {Object}  [headers={}]  Headers object
 *
 * @return  {Promise}
 */
export const getPage = function ( url, method = 'GET', headers = {} ) {
    const _headers = new Headers();

    for ( const key in headers ) {
        if ( headers[ key ] ) {
            _headers.append( key, headers[ key ] );
        }
    }

    _headers.append( 'Pragma', 'No-cache' );
    _headers.append( 'Cache-Control', 'No-cache' );

    const config = {
        method: method,
        headers: _headers,
        credentials: 'include',
        cache: 'no-store',
        client: 'no-window'
    };
    const f = fetch( url, config )
        .then( ( response ) => {
            if ( response.status >= 200 && response.status < 300 ) {
                return Promise.resolve( response );
            }
            return Promise.reject( new Error( response.statusText ) );
        } )
        .then( response => response.text() )
        .catch( e => console.error( e ) );
    return f;
};
