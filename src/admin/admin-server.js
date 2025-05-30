const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../public')));

// Главная страница админ-панели
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Swagger конфигурация
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shop Admin API',
      version: '1.0.0',
      description: 'API для управления товарами интернет-магазина',
    },
    servers: [{ url: `http://localhost:${port}` }],
  },
  apis: [path.join(__dirname, 'admin-server.js')],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const productsFile = path.join(__dirname, '../data/products.json');

// Получение всех товаров
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Получить список всех товаров
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   price:
 *                     type: number
 *                   description:
 *                     type: string
 *                   categories:
 *                     type: array
 *                     items:
 *                       type: string
 */
app.get('/products', (req, res) => {
  const products = JSON.parse(fs.readFileSync(productsFile));
  res.json(products);
});

// Добавление товара
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Добавить новый товар или несколько товаров
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   price:
 *                     type: number
 *                   description:
 *                     type: string
 *                   categories:
 *                     type: array
 *                     items:
 *                       type: string
 *               - type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     price:
 *                       type: number
 *                     description:
 *                       type: string
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       201:
 *         description: Товар(ы) добавлен(ы)
 */
app.post('/products', (req, res) => {
  const products = JSON.parse(fs.readFileSync(productsFile));
  const newProducts = Array.isArray(req.body) ? req.body : [req.body];
  const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
  newProducts.forEach((product, index) => {
    product.id = maxId + index + 1;
    products.push(product);
  });
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
  res.status(201).json(newProducts);
});

// Редактирование товара по ID
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Обновить товар по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Товар обновлён
 *       404:
 *         description: Товар не найден
 */
app.put('/products/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync(productsFile));
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) return res.status(404).json({ message: 'Товар не найден' });
  products[productIndex] = { id: parseInt(req.params.id), ...req.body };
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
  res.json(products[productIndex]);
});

// Удаление товара по ID
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Удалить товар по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Товар удалён
 *       404:
 *         description: Товар не найден
 */
app.delete('/products/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync(productsFile));
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) return res.status(404).json({ message: 'Товар не найден' });
  const deletedProduct = products.splice(productIndex, 1);
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
  res.json(deletedProduct);
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Админ-сервер запущен на http://localhost:${port}`);
});