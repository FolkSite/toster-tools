# Toster wysiwyg panel

[![Latest release](https://img.shields.io/github/release/yarkovaleksei/toster-wysiwyg-panel.svg)](https://github.com/yarkovaleksei/toster-wysiwyg-panel/releases/latest)  [![Build Status](https://travis-ci.org/yarkovaleksei/toster-wysiwyg-panel.svg?branch=master)](https://travis-ci.org/yarkovaleksei/toster-wysiwyg-panel)  [![Dependencies total](https://david-dm.org/yarkovaleksei/toster-wysiwyg-panel.svg)](https://david-dm.org/yarkovaleksei/toster-wysiwyg-panel.svg)  [![Chrome Web Store - version](https://img.shields.io/chrome-web-store/v/kpfolongmglpleidinnhnlefeoljdecm.svg)](https://chrome.google.com/webstore/detail/toster-wysiwyg-panel/kpfolongmglpleidinnhnlefeoljdecm?hl=ru&gl=RU)  [![Chrome Web Store - rating](https://img.shields.io/chrome-web-store/rating/kpfolongmglpleidinnhnlefeoljdecm.svg)](https://chrome.google.com/webstore/detail/toster-wysiwyg-panel/kpfolongmglpleidinnhnlefeoljdecm?hl=ru&gl=RU)

- - -
+ [Описание](#Описание)
+ [Установка](#Установка)
+ [Установка из репозитория](#Установка-из-репозитория)
+ [Установка в Opera](#Установка-в-opera)
+ [Установка в Google Chrome](#Установка-в-google-chrome)
+ [Установка в Firefox](#Установка-в-firefox)
+ [Разработчикам](#Разработчикам)
+ [Подготовка к работе](#Подготовка-к-работе)
+ [Проверка кода](#Проверка-кода)
+ [Сборка](#Сборка)
+ [Упаковка в zip перед публикацией](#Упаковка-в-zip-перед-публикацией)
+ [Подписывание расширения для Firefox](#Подписывание-расширения-для-firefox)

- - -
# Внимание

Если расширение недоступно по приведенной ссылке, то используйте установку из zip-архива (Opera, Chrome) или из xpi (Firefox), как описано [здесь](#Установка-из-репозитория)

[Наверх](#toster-wysiwyg-panel)

- - -
### Описание

**Расширение для браузеров [Google Chrome](https://chrome.google.com/webstore/detail/toster-wysiwyg-panel/kpfolongmglpleidinnhnlefeoljdecm), [Opera](https://addons.opera.com/ru/extensions/details/toster-wysiwyg-panel/) и [Firefox](https://addons.mozilla.org/en-US/firefox/addon/toster-wysiwyg-panel/)**

**Что умеет расширение:**

1. Живое обновление ответов и комментариев к вопросу
2. Живое обновление ленты вопросов
3. Живое обновление списка новых уведомлений
4. Добавляет возможность отправки ответа или комментария нажатием комбинации <kbd>Ctrl+Enter</kbd>
5. Добавляет возможность форматировать отступы клавишами <kbd>Tab/Shift+Tab</kbd>
6. Добавляет возможность скрывать правый сайдбар сайта
7. Добавляет возможность скрывать верхнюю панель со ссылками ТМ
8. Быстрый переход на страницу добавления нового вопроса и на страницу трекера
9. HTML5 Notification уведомление, клик по которому откроет страницу со списком уведомлений
10. Вывод количества непрочитанных уведомлений на иконку расширения, в виде текста на красном фоне
11. Комбинация <kbd>Alt+T</kbd> открывает popup с настройками
12. Возможность включать и отключать все опции в настройках

- - -
![Окно настроек](img/screenshot/screen-settings.png)

![Внешний вид оповещения Opera](img/screenshot/opera-screen-notify.png)

![Внешний вид оповещения Firefox](img/screenshot/ff-screen-notify.png)

[Наверх](#toster-wysiwyg-panel)

- - -
### Установка

[![Chrome web store](img/chrome.png)](https://chrome.google.com/webstore/detail/toster-wysiwyg-panel/kpfolongmglpleidinnhnlefeoljdecm)  [![Firefox Add-ons](img/ff.jpg)](https://addons.mozilla.org/en-US/firefox/addon/toster-wysiwyg-panel/)  [![Opera addons](img/opera.png)](https://addons.opera.com/ru/extensions/details/toster-wysiwyg-panel/)

[Наверх](#toster-wysiwyg-panel)

- - -
### Установка из репозитория

Скачиваем [отсюда](https://github.com/yarkovaleksei/toster-wysiwyg-panel/releases/latest) нужный файл для своего браузера:

- Opera и Google Chrome - **source_{VERSION}.zip**
- Firefox - *.xpi файл расширения

[Наверх](#toster-wysiwyg-panel)

- - -
#### Установка в Opera

Распаковываем архив:

```bash
$ cd ~/Загрузки
$ unzip source_{VERSION}.zip -d ./source
```

Теперь открываем браузер:

1. Жмем <kbd>Ctrl+Shift+E</kbd>
2. Нажимаем кнопку как на скрине
![Screenshot](img/opera-how-to.png)
3. Выбираем нашу папку (source), куда распакован архив, и нажимаем кнопку "Open"

[Наверх](#toster-wysiwyg-panel)

- - -
#### Установка в Google Chrome

Распаковываем архив:

```bash
$ cd ~/Загрузки
$ unzip source_{VERSION}.zip -d ./source
```

Теперь открываем браузер:

1. Вводим в строку браузера *chrome://extensions/*
2. Нажимаем кнопку как на скрине
![Screenshot](img/chrome-how-to.png)
3. Выбираем нашу папку (source), куда распакован архив, и нажимаем кнопку "Open"

[Наверх](#toster-wysiwyg-panel)

- - -
#### Установка в Firefox

1. Нажимаем правой кнопкой мыши на скачанный xpi файл. Имя файла примерно такое: *toster_wysiwyg_panel-{VERSION}-an+fx.xpi*
2. Выбираем в контекстном меню пункт "Открыть с помощью..."
3. Выбираем из предложенных вариантов Firefox

Откроется браузер:

1. Нажимаем кнопку как на скрине
![Screenshot](img/ff-how-to.jpg)

- - -
Готово! Теперь можно пользоваться Тостером и не нервничать :smile:

[Наверх](#toster-wysiwyg-panel)

- - -
### Разработчикам

- - -
#### Подготовка к работе

```bash
$ git clone git@github.com:yarkovaleksei/toster-wysiwyg-panel.git
$ cd toster-wysiwyg-panel
$ npm install
```

[Наверх](#toster-wysiwyg-panel)

- - -
#### Проверка кода

```bash
$ npm run lint
```

[Наверх](#toster-wysiwyg-panel)

- - -
#### Сборка

```bash
$ npm run compile
```

[Наверх](#toster-wysiwyg-panel)

- - -
#### Упаковка в zip перед публикацией

```bash
$ npm run zip
```

[Наверх](#toster-wysiwyg-panel)

- - -
#### Подписывание расширения для Firefox

Чтобы иметь возможность подписать файл для Firefox надо пройти по [этой ссылке](https://addons.mozilla.org/en-US/developers/addon/api/key/) и сохранить ваши ключи в файл *.jwtsign* в папке репозитория.

Файл должен выглядеть так:

```bash
APIKEY="user:123456789:999"
SECRETKEY="e1373f71d00aad90183b410c2e8661265a71845fd0805bd2bdca5fe66a635cfb"
```

Команда для создания и подписи файла:

```bash
$ npm run ffsign
```

[Наверх](#toster-wysiwyg-panel)
