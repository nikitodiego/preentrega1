# preentrega1

Para correr el proyecto, ejecutar en consola: npm run dev

A continuación se describen todas las funcionalidades y rutas de la API.

Las llamadas GET se pueden probar desde el navegador o con POSTMAN, en tanto que las llamadas POST, DELETE y PUT se prueban con POSTMAN.

PRODUCTOS:
GET: “localhost:8080”: Mensaje de bienvenida.
GET: “localhost:8080/api/productos”: Lista todos los productos.
GET: “localhost:8080/api/productos/:id_producto”: Lista un producto por su id. Si no lo encuentra retornará un objeto de error.
POST: “localhost:8080/api/productos”: Crea un nuevo producto (sólo cuando la variable administrador está en true).
Los campos a ingresar en el objeto producto son: title (string), price (number), thumbnail (string), stock (number). El id incremental es generado en la aplicación.
DELETE: “localhost:8080/api/productos/:id_producto”: Borra un producto según su id (sólo administrador).
PUT: “localhost:8080/api/productos/:id_producto”: Actualiza un producto según su id (sólo administrador).

CARRITOS:
GET: “localhost:8080/api/carrito”: Lista los carritos ya creados.
POST: “localhost:8080/api/carrito”: Crea un carrito con fecha e id incremental, aun sin productos.
GET: “localhost:8080/api/carrito/:id_carrito”: Muestra un objeto carrito por su id.
POST: “localhost:8080/carrito/:id_carrito/producto/:id_producto”: Agrega el producto con id_producto al carrito con id_carrito. Los nuevos productos se van agregando a una lista con sus ids, luego con un filter encuentro la cantidad de productos de un mismo id.
DELETE: “localhost:8080/carrito/:id_carrito/producto/:id_producto”: Borra el producto con id_producto del carrito con id_carrito.
GET: “localhost:8080/carrito/:id_carrito/producto/:id_producto”: Retorna la cantidad de productos con id_producto que hay en el carrito con id_carrito.
DELETE: “localhost:8080/api/carrito/:id_carrito”: Borra un carrito con todos sus productos.
