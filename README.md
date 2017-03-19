# Toster wysiwyg panel

- - -
[![Latest release](https://img.shields.io/github/release/yarkovaleksei/toster-wysiwyg-panel.svg)](https://github.com/yarkovaleksei/toster-wysiwyg-panel/releases/latest)  [![Build Status](https://travis-ci.org/yarkovaleksei/toster-wysiwyg-panel.svg?branch=master)](https://travis-ci.org/yarkovaleksei/toster-wysiwyg-panel)  [![Dependencies total](https://david-dm.org/yarkovaleksei/toster-wysiwyg-panel.svg)](https://david-dm.org/yarkovaleksei/toster-wysiwyg-panel.svg)  [![Chrome Web Store - version](https://img.shields.io/chrome-web-store/v/kpfolongmglpleidinnhnlefeoljdecm.svg)](https://chrome.google.com/webstore/detail/toster-wysiwyg-panel/kpfolongmglpleidinnhnlefeoljdecm?hl=ru&gl=RU)  [![Chrome Web Store - rating](https://img.shields.io/chrome-web-store/rating/kpfolongmglpleidinnhnlefeoljdecm.svg)](https://chrome.google.com/webstore/detail/toster-wysiwyg-panel/kpfolongmglpleidinnhnlefeoljdecm?hl=ru&gl=RU)

### Расширение для браузеров [Google Chrome](https://chrome.google.com/webstore/detail/toster-wysiwyg-panel/kpfolongmglpleidinnhnlefeoljdecm?hl=ru&gl=RU), Opera и [Firefox](https://addons.mozilla.org/en-US/firefox/addon/toster-wysiwyg-panel/)

- - -
### Информация

**Что умеет расширение?**

1. Расширение добавляет функционал редактора формы ответа к форме комментария для сайта [toster.ru](https://toster.ru)
2. Возможность отправки ответа или комментария нажатием комбинации Ctrl+Enter
3. Проверка новых уведомлений без перезагрузки страницы (опция и интервал проверки включается в настройках)

- - -
[![Screenshot](img/screen-form.png)](img/screen-form.png)

[![Screenshot](img/screen-settings.png)](img/screen-settings.png)

- - -
### Сборка

```bash
$ npm run compile [chrome] [opera] [ff]
```

- - -
### Упаковка в zip перед публикацией

```bash
$ npm run zip [chrome] [opera] [ff]
```

- - -
### Установка

[![Chrome web store](img/chrome.png)](https://chrome.google.com/webstore/detail/toster-wysiwyg-panel/kpfolongmglpleidinnhnlefeoljdecm?hl=ru&gl=RU)  [![Firefox Add-ons](img/ff.jpg)](https://addons.mozilla.org/en-US/firefox/addon/toster-wysiwyg-panel/)  ![Ожидание публикации](img/opera.png)

**Установка из репозитория(на примере Opera):**

Скачиваем [отсюда](https://github.com/yarkovaleksei/toster-wysiwyg-panel/releases/latest) нужный архив для своего браузера и распаковываем его:

**Linux**
```bash
$ cd ~/Загрузки
$ unzip opera.zip -d ./TWP
```

Теперь открываем браузер:

1. Жмем Ctrl+Shift+E
2. Нажимаем кнопку как на скрине
![Screenshot](img/opera-how-to.png)
3. Выбираем нашу папку, куда распакован архив, и нажимаем кнопку "Open"

Готово! Теперь можно пользоваться Тостером и не нервничать :smile:
