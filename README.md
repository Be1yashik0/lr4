# Интернет-магазин с GraphQL, REST API и WebSocket чатом

## Технологии

- **Backend**:
	- Node.js
    - Express
    - GraphQL 
    - REST API
    - WebSocket
    - Swagger
- **Frontend**:
    - HTML, CSS, JavaScript
    - Bootstrap 5.3.3
- **Хранение данных**:
    - JSON-файл 

## Установка

1. Склонируйте репозиторий:
    
    ```bash
    git clone https://github.com/Be1yashik0/lr4.git
    cd lr4
    ```
    
2. Установите зависимости:
    
    ```bash
    yarn install
    ```
    

## Запуск

Запустите три сервера в отдельных терминалах:

1. **Клиентский сервер** (GraphQL, порт 3000):
    
    ```bash
    yarn start
    ```
    
2. **Админ-сервер** (REST API, порт 8080):
    
    ```bash
    yarn admin
    ```
	
3. **WebSocket-сервер** (чат, порт 8081):
    
    ```bash
    yarn chat
    ```
    

## Использование

- **Клиентская часть**: Откройте `http://localhost:3000`
    - Просматривайте товары (5 карточек с ID, названием, ценой, описанием, категориями).
    - Используйте чат поддержки (отправляйте сообщения с префиксом «Покупатель»).
- **Админ-панель**: Откройте `http://localhost:8080`
    - Добавляйте/удаляйте товары через интерфейс.
    - Используйте чат поддержки (сообщения с префиксом «Админ»).
- **Swagger-документация**: `http://localhost:8080/api-docs`
    - Просматривайте REST API эндпоинты.
- **GraphQL-интерфейс**: `http://localhost:3000/graphql`
    - Тестируйте GraphQL-запросы в GraphiQL.

