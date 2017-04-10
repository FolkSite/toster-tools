- - -
Обновление до v3.0.0

1. :fire: Исправлена ошибка версии 2.0.2
2. Добавлен способ оповещения о непрочитанных уведомлениях (их количество выводится на иконке расширения)
3. В процесс разработки внедрен eslint
4. :fire: Исправлена ошибка с обработчиком комбинации Ctrl+Enter
5. Код переписан более универсально под разные браузеры, с учетом их особенностей
6. Функционал AJAX перенесен в background. Изначально была допущена ошибка архитектуры приложения (для работы расширения требовалась открытая вкладка с сайтом). Теперь все ОК :smile:
7. Добавлена ссылка для быстрого перехода на toster.ru

Upgrading to v3.0.0

1. :fire: Fixed bug with version 2.0.2
2. Added a way to alert about unread notifications (the number displayed on the icon of the extension)
3. In the development process added eslint
4. :fire: Fixed bug with the Ctrl+Enter key combination handler
5. The code is rewritten more universally for different browsers, taking into account their features
6. The functional AJAX is moved to the background. Initially, there was an application architecture error (an open tab with the site was required for the expansion work). Now everything is OK :smile:
7. Added link for a quick jump to toster.ru

- - -
Обновление до v3.8.3

1. В процесс разработки добавлен babel
2. Почищен код (удалены ненужные манипуляции с DOM)
3. Добавлена возможность скрывать правый сайдбар сайта
4. Добавлена возможность скрывать верхнюю панель со ссылками ТМ
5. Добавлено обновление левого сайдбара (список новых уведомлений)
6. Добавлен переход на страницу отзывов при удалении расширения
7. Добавлена ссылка в popup на добавление нового вопроса
8. Добавлена индикация AJAX запроса (моргает иконкой)
9. Обновлен интерфейс popup (добавлен jquery и bootstrap)
10. Добавлены и используются свои иконки для тулбара
11. Добавлены функциональные клавиши в тулбар

Upgrading to v3.8.3

1. Babel is added to the development process
2. The code has been cleared (unnecessary manipulations with DOM have been deleted)
3. Added the ability to hide the right sidebar of the site
4. Added the ability to hide the top panel with TM links
5. Added update of the left sidebar (list of new notifications)
6. Added a transition to the reviews page when deleting an extension
7. Added a link to the popup to add a new question
8. Added indication AJAX request (blinking icon)
9. Update interface popup (with jquery and bootstrap)
10. Added and used their own icons for the toolbar
11. Added function keys to the toolbar

- - -
Обновление до v3.11.6

1. Изменена иконка расширения. Да простят меня владельцы toster.ru :smile:
2. Исправлено присваивание ссылки для удаления расширения (привет ребятам из Opera)
3. Модифицирована форма настроек. Теперь она универсальная и нет жесткой привязки к элементу.
4. Исправлен баг с отображением количества уведомлений в заголовке иконки
5. Исправлены файлы локализации
6. Добавлена проверка наличия подключения к Интернету

Upgrade to v3.11.6

1. Changed the extension icon. Excuse me the owners toster.ru :smile:
2. Fixed assignment of a link to delete the extension (hello to the guys from Opera)
3. The configuration form has been modified. Now it is universal and there is no rigid binding to the element.
4. Fixed bug with displaying the number of notifications in the title of the icon
5. Fixed localization files
6. Added check for Internet connection

- - -
Обновление до v3.12.7

1. Добавлена возможность форматировать отступы кода клавишами Tab/Shift+Tab
2. Удалены неиспользуемые скрипты и шрифты

Upgrade to v3.12.7

1. Added the ability to format the indentation of the code with the keys Tab/Shift+Tab
2. Removed unused scripts and fonts

- - -
Обновление до v3.20.9

1. Удален кастомный тулбар для формы комментирования, так как на сайте обновили форму и он больше не нужен
2. Удален foundation-icons.css и шрифты к нему. Используются отдельные svg-иконки.
3. Добавлена возможность включать/отключать форматирование отступов кода клавишами Tab/Shift+Tab
4. При упаковке в zip автоматически подставляется версия из manifest.json в имя архива
5. Удалена кнопка "Сохранить" на экране настроек
6. Заменен bootstrap.min.css
7. На экране настроек добавлены кнопки перехода на страницу расширения и страницу отзывов
8. Удален content.css
9. Исправлена ​​ошибка #7
10. Добавлено живое обновление ответов и комментариев к вопросу!

Upgrade to v3.20.9

1. The custom toolbar is removed for the comment form, because the site was updated and it is no longer needed
2. Removed foundation-icons.css and fonts to it. Used svg icons.
3. Added the ability to enable/disable the formatting of the indentation of the code with the keys Tab/Shift+Tab
4. When packing in zip, the version of manifest.json is automatically substituted in the archive name
5. The "Save" button in the settings screen was deleted
6. Replaced bootstrap.min.css
7. On the settings screen, you have added the buttons to the extension page and the feedback page
8. Removed content.css
9. Fix #7 issue
10. Added a new update of the answers and comments to the question!

- - -
Обновление до v3.22.10

1. Закрыта задача #4
2. Закрыта задача #14
3. Исправлен обработчик клика на всплывающее уведомление

Upgrade to v3.22.10

1. Fix #4 issue
2. Fix #14 issue
3. Fixed the click handler for the pop-up notification

- - -
Обновление до v3.30.11

1. Обновлена иконка "Задать вопрос"
2. Добавлены CSS стили для новых вопросов при обновлении ленты
3. Добавлено звуковое уведомление для новых вопросов при обновлении ленты
4. Добавлено звуковое уведомление для новых ответов на текущий открытый вопрос
5. Добавлено звуковое уведомление для непрочитанных уведомлений
6. В настройки вынесена возможность выбрать звук уведомления
7. Закрыта задача #15
8. Закрыта задача #16
9. Исправлены почти все утечки памяти (но не все :cry:)

Upgrade to v3.30.11

1. Updated the icon "Ask a question"
2. Added CSS styles for new issues when updating a tape
3. Added sound notification for new questions when updating the tape
4. Added a sound notification for new answers to the current open question
5. Added sound notification for unread notifications
6. The settings made it possible to choose the sound notification
7. Fix #15 issue
8. Fix #16 issue
9. Fixed almost all memory leaks (but not all :cry:)
