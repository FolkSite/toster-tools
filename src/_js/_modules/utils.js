/**
 * @description Модуль utils
 * @module utils
 */

/**
 * @description  Объект браузера для работы с API расширения
 *
 * @return  {Browser}
 */
const Device = ( () => {
    if ( typeof browser === 'undefined' ) {
        return chrome;
    }
    return browser;
} )();

/**
 * @description  Если браузер Google Chrome, то константа имеет значение true
 *
 * @return  {Boolean}
 */
const isChrome = ( window.chrome && /chrome\//i.test( window.navigator.userAgent ) );

/**
 * @description  Если браузер Opera, то константа имеет значение true
 *
 * @return  {Boolean}
 */
const isOpera = ( ( ( window.opr && window.opr.addons ) || window.opera ) || /opr\//i.test( window.navigator.userAgent ) );

/**
 * @description  Если браузер Firefox, то константа имеет значение true
 *
 * @return  {Boolean}
 */
const isFirefox = ( ( typeof InstallTrigger !== 'undefined' ) || /firefox/i.test( window.navigator.userAgent ) );

/**
 * @description  Обертка над *.i18n.getMessage. Используется для локализации расширения.
 * @function
 *
 * @param   {String}  msg  ID фразы
 * @param   {Array}  [placeholders=[]]  Массив фраз-плэйсхолдеров. Подробнее {@link https://developer.chrome.com/extensions/i18n|в документации}
 *
 * @return  {String}  Фраза в нужной локализации
 */
const _l = ( msg, placeholders = [] ) => Device.i18n.getMessage( msg, placeholders );

/**
 * @description  Функция открывает переданный URL в новой вкладке
 * @function
 *
 * @param   {String}  url  URL страницы
 */
const openWin = url => Device.tabs.create( {
    url: url
}, tab => tab );


/**
 * @description  Обертка над window.fetch
 * @function
 *
 * @param   {String}  url  URL страницы
 * @param   {String}  [method="GET"]  HTTP метод 
 * @param   {Object}  [headers={}]  Заголовки запроса
 *
 * @return  {Promise}
 */
const getPage = ( url, method = 'GET', headers = {} ) => {
    const _headers = new Headers();

    const keys = Object.keys( headers );
    for ( let i = 0, len = keys.length; i < len; i++ ) {
        _headers.append( keys[ i ], headers[ keys[ i ] ] );
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


export {
    Device,
    isChrome,
    isOpera,
    isFirefox,
    _l,
    openWin,
    getPage
};
