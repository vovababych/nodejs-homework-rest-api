**Читать на других языках: [Русский](readme.md), [Українська](README.ua.md).**

![Альтернативный текст](/screenshots/18.jpg 'Подсказка')

## GoIT Node.js Course Template Homework

Выполните форк этого репозитория для выполнения домашних заданий (2-6) Форк
создаст репозиторий на вашем http://github.com

Добавьте ментора в коллаборацию

Для каждой домашней работы создавайте свою ветку.

- [hw02](https://github.com/vovababych/nodejs-homework-rest-api/tree/02-express)
- [hw03](https://github.com/vovababych/nodejs-homework-rest-api/tree/03-mongodb)
- [hw04](https://github.com/vovababych/nodejs-homework-rest-api/tree/04-auth)
- hw05
- hw06

Каждая новая ветка для дз должна делаться с master

После того как вы закончили выполнять домашнее задание в своей ветке, необходимо
сделать пулл-реквест (PR). Потом добавить ментора для ревью кода. Только после
того как ментор заапрувит PR, вы можете выполнить мердж ветки с домашним
заданием в мастер.

Внимательно читайте комментарии ментора. Исправьте замечания и сделайте коммит в
ветке с домашним заданием. Изменения подтянуться в PR автоматически после того
как вы отправите коммит с исправлениями на github После исправления снова
добавьте ментора на ревью кода.

- При сдаче домашней работы есть ссылка на PR
- JS-код чистый и понятный, для форматирования используется Prettier

### Команды:

- `npm start` &mdash; старт сервера в режиме production
- `npm run start:dev` &mdash; старт сервера в режиме разработки (development)
- `npm run lint` &mdash; запустить выполнение проверки кода с eslint, необходимо
  выполнять перед каждым PR и исправлять все ошибки линтера
- `npm lint:fix` &mdash; та же проверка линтера, но с автоматическими
  исправлениями простых ошибок

# Домашнє завдання 4

Створи гілку `04-auth` з гілки `master`.

Продовж створення REST API для роботи з колекцією контактів. Додай логіку
аутентифікації / авторизації користувача через [JWT](https://jwt.io/).

## Крок 1

У коді створи схему і модель користувача для колекції `users`.

```js
{
  email: String,
  password: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free"
  },
  token: String
}
```

Змініть схему контактів, щоб кожен користувач бачив тільки свої контакти. Для
цього в схемі контактів додайте властивість

```js
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    }
```

## Крок 2

### Регістрація

Створити ендпоінт [`/auth/register`](#registration-request)

Зробити валідацію всіх обов'язкових полів (email і password). при помилку
валідації повернути [Помилку валідації](#registration-validation-error).

У разі успішної валідації в моделі `User` створити користувача за даними які
пройшли валідацію. Для засолювання паролів використовуй
[bcrypt](https://www.npmjs.com/package/bcrypt)

- Якщо пошта вже використовується кимось іншим, повернути
  [Помилку Conflict](#registration-conflict-error).
- В іншому випадку повернути
  [успішна відповідь](#registration-success-response).

#### Registration request

```shell
POST /auth/register
Content-Type: application/json
RequestBody: {
  "email": "example@example.com",
  "password": "examplepassword"
}
```

#### Registration validation error

```shell
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: <Ошибка от Joi или другой валидационной библиотеки>
```

#### Registration conflict error

```shell
Status: 409 Conflict
Content-Type: application/json
ResponseBody: {
  "message": "Email in use"
}
```

#### Registration success response

```shell
Status: 201 Created
Content-Type: application/json
ResponseBody: {
  "user": {
    "email": "example@example.com",
    "subscription": "free"
  }
}
```

### Логін

Створити ендпоінт [`/auth/login`](#login-request)

В моделі `User` знайти користувача за `email`.

Зробити валідацію всіх обов'язкових полів (email і password). При помилці
валідації повернути [Помилку валідації](#validation-error-login).

- В іншому випадку, порівняти пароль для знайденого користувача, якщо паролі
  збігаються створити токен, зберегти в поточному юзера і повернути
  [Успешный ответ](#login-success-response).
- Якщо пароль або імейл невірний, повернути
  [Помилку Unauthorized](#login-auth-error).

#### Login request

```shell
POST /auth/login
Content-Type: application/json
RequestBody: {
  "email": "example@example.com",
  "password": "examplepassword"
}
```

#### Login validation error

```shell
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: <Ошибка от Joi или другой валидационной библиотеки>
```

#### Login success response

```shell
Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "token": "exampletoken",
  "user": {
    "email": "example@example.com",
    "subscription": "free"
  }
}
```

#### Login auth error

```shell
Status: 401 Unauthorized
ResponseBody: Email or password is wrong
```

## Крок 3

### Перевірка токена

Створи мідлвар для перевірки токена і додай його до всіх раутам які повинні бути
захищені.

- Мідлвар бере токен з заголовків `Authorization`, перевіряє токен на
  валідність.
- У випадку помилки повернути
  [Помилку Unauthorized](#middleware-unauthorized-error).
- Якщо валідація пройшла успішно, отримати з токена id користувача. Знайти
  користувача в базі даних з цього id. Якщо користувач існує, записати його дані
  в `req.user` і викликати `next()`. Якщо користувача з таким id НЕ существет,
  повернути [Помилку Unauthorized](#middleware-unauthorized-error)

#### Middleware unauthorized error

```shell
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}
```

## Крок 4

### Логаут

Створити ендпоінт [`/auth/logout`](#logout-request)

Додай в раут мідлвар перевірки токена.

- У моделі `User` знайти користувача за `_id`.
- Якщо користувача не повернути
  [Помилку Unauthorized](#logout-unauthorized-error).
- В іншому випадку, видалити токен в поточному юзера і повернути
  [успішна відповідь](#logout-success-response).

#### Logout request

```shell
POST /auth/logout
Authorization: "Bearer token"
```

#### Logout unauthorized error

```shell
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}
```

#### Logout success response

```shell
Status: 204 No Content
```

### Поточний - отримати дані юзера по токені

Створити ендпоінт [`/users/current`](#current-user-request)

Додай в раут мідлвар перевірки токена.

- Якщо користувача не повернути
  [Помилку Unauthorized](#current-user-unauthorized-error)
- В іншому випадку повернути [Успішну відповідь](#current-user-success-response)

#### Current user request

```shell
GET /users/current
Authorization: "Bearer token"
```

#### Current user unauthorized error

```shell
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}
```

#### Current user success response

```shell
Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "email": "example@example.com",
  "subscription": "free"
}
```

## Додаткове завдання - необов'язкове

- Зробити пагінацію з
  [mongoose-paginate-v2](https://www.npmjs.com/package/mongoose-paginate-v2) для
  колекції контактів (GET / contacts? page = 1 & limit = 20).
- Зробити фільтрацію контактів по типу підписки (GET / contacts? Sub = free)
- Оновлення підписки (`subscription`) користувача через ендпоінт PATCH / users.
  Підписка повинна мати одне з наступних значень `['free', 'pro', 'premium']`

# Домашнє завдання 3

Створи гілку `03-mongodb` з гілки `master`.

Продовж створення REST API для роботи з колекцією контактів.

## Крок 1

Створи аккаунт на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). Після
чого в акаунті створи новий проект і настрій **бесплатный кластер**. Під час
налаштування кластера вибери провавйдера і регіон. Якщо вибрати занадто
віддалений регіон, швидкість відповіді сервера буде довше.

## Крок 2

Установи графічний редактор
[MongoDB Compass](https://www.mongodb.com/download-center/compass) для зручної
роботи з базою даних для MongoDB. Настрій підключення своєї хмарної бази даних
до Compass. У MongoDB Atlas не забудь створити користувача з правами
адміністратора.

## Крок 3

Через Compass створи базу даних `db-contacts` і в ній колекцію `contacts`.
Візьми
[ссылка на json](https://github.com/goitacademy/nodejs-homework/blob/master/homework-03/contacts)
і за допомогою Compass наповни колекцію `contacts` (зроби імпорт) його вмістом.

## Крок 4

Використовуй вихідний код
[домашней работы #2](https://github.com/vovababych/nodejs-homework-rest-api/tree/02-express)
і заміни зберігання контактів з json-файлу на створену тобою базу даних.

- Напиши код для створення підключення до MongoDB за допомогою
  [Mongoose](https://mongoosejs.com/).
  - При успішному підключенні виведи в консоль повідомлення
    `"Database connection successful"`.
  - Обов'язково обробив помилку підключення. Виведи в консоль повідомлення
    помилки і заверши процес використовуючи `process.exit(1)`.
- У функціях обробки запитів заміни код CRUD-операцій над контактами з файлу, на
  Mongoose-методи для роботи з колекцією контактів в базі даних.

# Домашнє завдання 2

Створи гілку `02-express` з гілки `master`.

Написать REST API для работы с коллекцией контактов. Для работы с REST API
используй [Postman](https://www.getpostman.com/).

## Крок 1

Добавь в проект пакеты [express](https://www.npmjs.com/package/express),
[morgan](https://www.npmjs.com/package/morgan) и
[cors](https://www.npmjs.com/package/cors).

## Крок 2

У index.js веб сервер на express і додаємо прошарку morgan і cors. налаштовуй
раутінг для роботи з колекцією контактів.

REST API повинен підтримувати такі раути.

### @ GET /api/contacts

- нічого не отримує
- викликає функцію `listContacts` для роботи з json-файлом contacts.json
- повертає масив всіх контактів в json-форматі зі статусом 200

### @ GET /api/contacts/:contactId

- Не отримує body
- Отримує параметр `contactId`
- викликає функцію getById для роботи з json-файлом contacts.json
- якщо такий id є, повертає об'єкт контакту в json-форматі зі статусом 200
- якщо такого id немає, повертає json з ключем `"message": "Not found"` і
  статусом 404

### @ POST /api/contacts

- Отримує body в форматі `{name, email, phone}`
- Якщо в body немає якихось обов'язкових полів, повертає json з ключем
  `{"message": "missing required name field"}` і статусом 400
- Якщо з body все добре, додає унікальний ідентифікатор в об'єкт контакту
- Викликає функцію `addContact(body)` для збереження контакту в файлі
  contacts.json
- За результатом роботи функції повертає об'єкт з доданим id
  `{id, name, email, phone}` і статусом 201

### @ DELETE /api/contacts/:contactId

- Не отримує body
- Отримує параметр `contactId`
- Викликає функцію `removeContact` для роботи з json-файлом contacts.json
- якщо такий id є, повертає json формату `{"message": "contact deleted"}` і
  статусом 200
- якщо такого id немає, повертає json з ключем `"message": "Not found"` і
  статусом 404

### @ PATCH /api/contacts/:contactId

- Отримує параметр `contactId`
- Отримує body в json-форматі c оновленням будь-яких полів `name, email и phone`
- Якщо body немає, повертає json з ключем `{"message": "missing fields"}` і
  статусом 400
- Якщо з body всі добре, викликає функцію `updateContact(contactId, body)`
  (Напиши її) для поновлення контакту в файлі contacts.json
- За результатом роботи функції повертає оновлений об'єкт контакту і
  статусом 200. В іншому випадку, повертає json з ключем
  `"message": "Not found"` і статусом 404
