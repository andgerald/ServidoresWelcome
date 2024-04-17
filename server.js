const express = require("express");
const app = express();
//para trabajar asyncronico se utiliza el promise
const fs = require("fs").promises;

// iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});

//levantar el servidor desde la ruta raiz
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//Disponibilizar una ruta para crear un archivo a partir de los
//parámetros de la consulta recibida
app.get("/crear", async (req, res) => {
  const { archivo, contenido } = req.query;
  //const archivo = req.query.archivo   *esto funciona igual que la linea 20*
  //const archivo = req.query.contenido

  try {
    await fs.writeFile(archivo, contenido);
    res.send(`El archivo ${archivo} ha sido creado con exito`);
  } catch (error) {
    res.status(500).send("Ocurrio un error al crear el archivo");
  }
});

// Disponibilizar una ruta para devolver el contenido de un archivo cuyo nombre es
// declarado en los parámetros de la consulta recibida
app.get("/leer", async (req, res) => {
  const { archivo } = req.query;
  try {
    await fs.readFile(archivo);
    res.sendFile(__dirname + "/" + archivo);
  } catch (error) {
    if (archivo == "") {
      res.status(500).send(`No se recibio archivo`);
    } else {
      res.status(500).send(`No se existe el archivo: ${archivo}`);
    }
  }
});

// Disponibilizar una ruta para renombrar un archivo, cuyo nombre y nuevo nombre es
// declarado en los parámetros de la consulta recibida
app.get("/renombrar", async (req, res) => {
  const { nombre, nuevoNombre } = req.query;
  try {
    await fs.rename(nombre, nuevoNombre);
    res.send(`El archivo ${nombre} se ha renombrado como ${nuevoNombre}`);
  } catch (error) {
    res.status(500).send(`No se pudo renombrar el archivo: ${archivo}`);
  }
});

// Disponibilizar una ruta para eliminar un archivo, cuyo nombre es declarado en los
// parámetros de la consulta recibida
app.get("/eliminar", async (req, res) => {
  const { archivo } = req.query;
  try {
    await fs.unlink(archivo);
    res.send(`El archivo ${archivo} ha sido eliminado`);
  } catch (error) {
    //agregar error cuando uno no le pasa nada
    res.status(500).send(`El archivo: ${archivo} no se ha eliminado`);
  }
});
