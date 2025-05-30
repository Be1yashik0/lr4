
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Статические файлы
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// GraphQL схема
const typeDefs = fs.readFileSync(path.join(__dirname, '../schema/schema.graphql'), 'utf8');

// Резолверы
const resolvers = {
  Query: {
    products: () => {
      try {
        const products = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/products.json')));
        return products;
      } catch (error) {
        console.error('Ошибка чтения products.json:', error);
        return [];
      }
    },
  },
};

// Настройка Apollo Server
async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });
  app.listen(port, () => {
    console.log(`Клиентский сервер запущен на http://localhost:${port}`);
    console.log(`GraphQL доступен на http://localhost:${port}${server.graphqlPath}`);
  });
}

startApolloServer();