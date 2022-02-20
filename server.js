let modulo = require("./claseProductos")
const prod = new modulo.nombreExportacion("./productos.json");
let moduloCarrito = require("./claseCarrito")
const carro = new moduloCarrito.Carro("./carrito.json");

const express = require('express');
const app = express();
const { Router } = require('express');
const router = Router();
const routerCarrito = Router();

//Middlewares
app.use('/api/productos', router);
app.use('/api/carrito',routerCarrito);
app.use(express.json());
app.use(express.urlencoded({extended: false }));

//admin
let administrador = true;

//Endpoint de bienvenida
app.get("/", (req,res) =>{
    res.send("Bienvenid@ a la API RESTful")
})

//Lista todos los productos
router.get('/', async (req,res) => {
    const a = await prod.getAll();
    res.send(a);
});

//Lista productos por id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const a = await prod.getById(id);
    if (a == null) {
        res.json({ error: 'producto no encontrado' });
    } else {
        res.json(a);
    }
});

//Agrega productos (administrador)
app.post('/api/productos', async (req, res) => {
    if (administrador) {
        const a = await req.body;
        const b = await prod.save(req.body);
        const c = await prod.getById(b);
        res.json({ "producto agregado": c });
    } else { res.json({ "mensaje": "Usted no tiene permiso de administrador" }) }
});

//Borra productos por id (administrador)
router.delete('/:id', async (req, res) => {
    if (administrador) {
        const { id } = req.params;
        const a = await prod.getById(id);
        if (a == null) {
            res.json({ error: 'producto no encontrado' });
        } else {
            const b = await prod.deleteById(id);
            const c = await prod.getAll();
            res.json(c);
        }
    } else { res.json({ "mensaje": "Usted no tiene permiso de administrador" }) }
});

//Modifica productos por id (administrador)
app.put('/api/productos/:id', (req, res) => {
    if (administrador) {
        let id = req.params.id;
        let a = req.body;
        let b = a.title;
        let c = a.price;
        let d = a.thumbnail;
        let e = a.stock;
        const fs = require('fs');
        const jsonData = fs.readFileSync("productos.json");
        const data = JSON.parse(jsonData);
        for (element of data) {
            if (element.id == id) {
                element.title = b;
                element.price = c;
                element.thumbnail = d;
                element.stock = e;
            }
        }
        fs.writeFileSync("productos.json", (JSON.stringify(data)));
        res.json(data);
    } else { res.json({ "mensaje": "Usted no tiene permiso de administrador" }) }
});


//Endpoints carrito
//Lista todos los carritos
routerCarrito.get('/', async (req,res) => {
    const a = await carro.getAll();
    res.send(a);
})

//Crea un nuevo carrito con id y fecha, aun sin productos
app.post('/api/carrito', (req, res) => {
    //Guardo carrito
    const b = carro.save({});
    res.json({"carrito creado": b});
  });

//Muestra un carrito por id
routerCarrito.get('/:id', async (req, res) => {
    const { id } = req.params;
    const a = await carro.getById(id);
    if (a == null) {
        res.json({ error: 'carrito no encontrado' });
    } else {
        res.json(a);
    }
});

//Agrega productos a un carrito con ambos ids
app.post('/carrito/:id_carrito/producto/:id_producto', (req, res) => {
    const id_carrito = req.params.id_carrito;
    const id_producto = req.params.id_producto;
    console.log(req.params)
    const fs = require('fs');
    let array = [];
    const leer = fs.readFileSync("./carrito.json", "utf-8");
    array = JSON.parse(leer);
    for (let n of array) {
        if (n.id == id_carrito) {
            n.productos.push(parseInt(id_producto));
            break;
        }
    }
    const a = JSON.stringify(array);
    fs.writeFileSync("./carrito.json", a);
    res.json(array);
    }
);

//Borra un producto de un carrito por ambos ids
app.delete('/carrito/:id_carrito/producto/:id_producto', (req, res) => {
    const id_carrito = req.params.id_carrito;
    const id_producto = req.params.id_producto;
    console.log(req.params)
    const fs = require('fs');
    let array = [];
    const leer = fs.readFileSync("./carrito.json", "utf-8");
    array = JSON.parse(leer);
    for (let n of array){
        if ((n.id == id_carrito) && (n.productos.includes(parseInt(id_producto)))){
            let index = n.productos.indexOf(parseInt(id_producto));
            n.productos.splice(index, 1);
            }
       }
    const a = JSON.stringify(array);
    fs.writeFileSync("./carrito.json", a);
    res.json(array);
});

//Muestra la cantidad de un producto que hay en un carrito por ambos ids
app.get('/carrito/:id_carrito/producto/:id_producto', (req, res) => {
    const id_carrito = req.params.id_carrito;
    const id_producto = req.params.id_producto;
    console.log(req.params)
    const fs = require('fs');
    let array = [];
    const leer = fs.readFileSync("./carrito.json", "utf-8");
    array = JSON.parse(leer);
    for (let n of array){
        if ((n.id == id_carrito) && (n.productos.includes(parseInt(id_producto)))){
            const filtrada = n.productos.filter(elem => elem == id_producto)
            res.json({ "cantidad": filtrada.length})
            break;
            }
        }res.json({ "cantidad" : 0})
    });

//Borra un carrito completo por id
routerCarrito.delete('/:id', async (req,res) =>{
    const {id} = req.params;
    const a = await carro.getById(id);
    if (a == null){
        res.json({ error : 'carrito no encontrado'});
    } else {
        const b = await carro.deleteById(id);
        const c = await carro.getAll();
        res.json(c);
        }
});


//Servidor escuchando
const PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
    console.log(`Server on port ${PORT}`);
})
