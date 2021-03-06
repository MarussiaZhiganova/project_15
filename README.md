﻿**Проектная работа посвящена созданию удаленного сервера и работе с ним в проекте Mesto.**

https://github.com/MarussiaZhiganova/project_15

Версия: 0.0.1

**Краткая информация о проекте:**

ПО для выполнения работы: Git, Express, NPM-пакеты, MongoDB, Postman.

### Ссылки

-   Фронтенд проекта доступен по адресам:
    -   [mestomaru.xyz](https://mestomaru.xyz/)
    -   [www.mestomaru.xyz](https://www.mestomaru.xyz/)
-   Бэкенд проекта доступен по адресам:
    -   [api.mestomaru.xyz](https://api.mestomaru.xyz/)
    -   [www.api.mestomaru.xyz](https://www.api.mestomaru.xyz/)
    -   [84.201.129.215](http://84.201.129.215/)
-   [Актуальная версия проекта на Github - v0.0.1](https://github.com/MarussiaZhiganova/project_15)

-   все ошибки обрабатываются централизованно;
-   тела запросов и, где необходимо, заголовки и параметры, валидируются по определённым схемам. Если запрос не соответствует схеме, обработка не передаётся контроллеру и клиент получает ошибку валидации;
-   все запросы и ответы записываются в файл request.log;
-   все ошибки записываются в файл error.log;
-   файлы логов не добавляются в репозиторий;
-   к серверу можно обратиться по публичному IP-адресу, указанному в README.md;
-   к серверу можно обратиться по http и по https, используя домен, указанный в README.md;
-   секретный ключ для создания и верификации JWT хранится на сервере в .env файле. Этот файл не добавляется в git;
-   в режиме разработки (когда process.env.NODE_ENV !== 'production') код запускается и работает без наличия .env файла;
-   сервер самостоятельно восстанавливается после GET-запроса на URL /crash-test.
 

