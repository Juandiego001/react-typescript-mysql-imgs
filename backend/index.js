const fs = require('fs');
require('dotenv').config();
const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { CONNREFUSED } = require('dns');

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        let theDir = '../frontend/public/userImages';
        let existsDir = fs.existsSync(theDir);

        function createDir() {
            return new Promise(resolve => {
                fs.mkdir(theDir, err => {
                    if (!err) {
                        resolve(true);
                    } else {
                        throw new Error("No se logró crear la carpeta");
                    }
                });
            })
        }

        if (!existsDir) {
            await createDir();
        }

        cb(null, '../frontend/public/userImages')
    },
    filename: (req, file, cb) => {
        let theFile = file.originalname;
        let suffix = theFile.split(".")[1];
        let { email } = req.body;
        cb(null, email + "." + suffix);
    }
})

const upload = multer({ storage: storage });

const app = express();

const PORT = process.env.PORT;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const connection = mysql.createConnection({
    "host": "localhost",
    "port": DB_PORT,
    "user": DB_PASS,
    "password": DB_USER,
    "database": DB_NAME
})

connection.connect(async err => {
    if (err) {
        console.log("Ocurrió un error al intentar conectar la base de datos");
        return;
    }

    console.log("¡La base de datos se ha conectado exitosamente!");
})

// Middlewares
app.use(cors());
app.use(express.json());

app.route("/users")
    // Para obtener los usuarios
    .get(async (req, res) => {
        function callQueryUsers() {
            return new Promise(resolve => {
                connection.query("SELECT * FROM users", (err, results, fields) => {
                    if (err) resolve([]);
                    else resolve(results);
                })
            })
        }

        let theUsers = await callQueryUsers();

        if (theUsers.length > 0) {
            res.json({
                "code": 200,
                "message": "¡Se han obtenido los usuarios con éxito!",
                "data": theUsers
            })
        } else {
            res.json({
                "code": 201,
                "message": "Al parecer, no han habido usuarios registrados",
                "data": []
            })
        }
    })

    // Para insertar usuarios
    .post(upload.single('user_photo'), async (req, res) => {
        let { email, password } = req.body;
        
        let theFile = req.file;
        let user_photo = theFile ? 1 : 0;
        let suffix_photo = theFile ? theFile.originalname.split(".")[1] : null;

        /*
            0 -> Not finished yet
            1 -> Finished
            2 -> Finished but with errors
        */
        let finishedQuery = 0;

        function makeQuery() {
            return new Promise(resolve => {
                connection.query("INSERT INTO users VALUES(?, ?, ?, ?)", [email, password, user_photo, suffix_photo], 
                    (err, results, fields) => {
                        console.log("err");
                        console.log(err);

                        if (err) {
                            resolve(2);
                        } else {
                            resolve(1);
                        }
                    });
            })
        }

        finishedQuery = await makeQuery();

        if (finishedQuery == 1) {
            res.json({
                "code": 200,
                "message": "¡El usuario se ha creado con éxito!",
            })
        } else {
            res.json({
                "code": 300,
                "message": "Hubo un error al intentar crear el usuario",
            })
        }
    })

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})