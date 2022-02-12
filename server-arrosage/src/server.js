// // Dependencies server http
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

// // Dependencies arduino
const serialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const ARDUINO_SERIAL_PORT = "/dev/ttyACM0";

// Le seuil de la valeur du capteur à partir duquel on considère que l'arrosage est activé
// Change lors du chargement des pots donc du type de sol correspondant
let seuil_val_capt = 100.0;

// Websocket
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: "http://127.0.0.1:3000",
  methods: ["GET", "POST"],
});

// Access to database
const knex = require("knex")
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./server-arrosage/Database/db.sqlite')
const connectKnex = knex({
  client: "sqlite3",
  connection: {
    filename: "./server-arrosage/Database/db.sqlite"
  }
})
// Intervalle d'envoi de données (1s)
let interval;

// Initialisation de la websocket
// Elle envoie les données à chaque seconde au client connecté
io.on("connection", (socket) => {
  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => getApiAndEmit(socket), 1000);

  // Réception de la donnée d'arrosage auto du frontend
  socket.on("message", (name, value) => {
    if (name === "ArrosageAuto") {
      data.arroserAuto = value;
    }
    if (name === "Arroser" && !data.arroserAuto) {
      data.arroser = value;
    }
  });

  socket.on("disconnect", () => {
    clearInterval(interval);
  });

  socket.on("getAllSoils", async(callback) => {
    callback(await getAllSoils());
  })

  socket.on("getAllPlants", async(callback) => {
    callback(await getAllPlants());
  })

  socket.on("getAllPots", async(callback) => {
    callback(await getAllPots());
  })

  socket.on("updatePotById", async(idPot, idPlant, idSoil) => {
    await updatePotById(idPot, idSoil, idPlant);
  })

});

// On va mettre dans cet objet la donnée à envoyer au frontend
let data = {
  arroser: false,
  arroserAuto: false,
  pourcentage: 0,
  response: 0,
};

// Envoi de la donnée au frontend via websocket
const getApiAndEmit = (socket) => {
  // XXX Uncomment this
  socket.emit("FromAPI", data);
  //socket.emit("FromAPI", simulateurPourcentageResponse());
};

// Lancement du serveur ici
server.listen(8484, () => console.log("Server started on port 8484"));

// Fonction pour simuler les données d'arrosage
const simulateurPourcentageResponse = () => {
  const pourcentage = Math.floor(Math.random() * 100);
  const response = calculReponse(pourcentage);

  data.pourcentage = pourcentage;
  data.response = response;
  return { pourcentage, response };
};

const calculReponse = (pourcentage) => {
  if (data.arroserAuto) {
    return seuil_val_capt >= pourcentage ? 0 : 1;
  } else {
    return data.arroser ? 0 : 1;
  }
};

// XXX Uncomment this
let arduino = new serialPort(ARDUINO_SERIAL_PORT, {
  baudRate: 9600,
});

arduino.pipe(new Readline({ delimiter: "\n" }));

// On récupère la données depuis l'arduino
arduino.on("data", (arduinoData) => {
  const pourcentage = parseFloat(arduinoData.toString());
  if (pourcentage) {
    // const response = data.arroserAuto && pourcentage >= SEUIL_VAL_CAPT ? 1 : 0;
    const response = calculReponse(pourcentage);

    // On change la données qu'on va envoyer au frontend
    data.pourcentage = pourcentage;
    data.response = response;


    console.log("data to send : ",data)

    arduino.write(data.response + "\n", (err) => {
      if (err) console.log("erreur dans l'envoi de la donnée ");
    });
  }
});

/* FUNCTIONS FOR SOILS */
const getAllSoils = async () => {
  return connectKnex('Soil').select('*');
}

/* FUNCTIONS FOR PLANTS */
const getAllPlants = async () => {
  return connectKnex('Plant').select("*");
}

/* FUNCTIONS FOR POTS */
const getAllPots = async () => {
  let result = await connectKnex('Pot').select('*');
  let output = [];
  if (result.length === 0) return null;
  for (let i = 0; i < result.length; i++) {
    let plant = await connectKnex('Plant').where({Id: result[i].IdPlant}).select('*');
    let soil = await connectKnex('Soil').where({Id: result[i].IdSoil}).select('*');
    if (plant[0] === undefined) plant = [{Name: "void", MinAbs: 0, CC: 0, Min: 0}];
    if (soil[0] === undefined) soil = [{Name: "void", MinAbs: 0, CC: 0, Min: 0}];
    let minAbs = Math.min(soil[0].PtFletrissement, soil[0].EauDispo);
    let min = Math.max(soil[0].PtFletrissement, soil[0].EauDispo);
    output = [...output, {
      Id: result[i].Id,
      Humidity: result[i].Humidity,
      Plant: plant[0].Name,
      Soil: soil[0].Name,
      PlantImage: plant[0].Image,
      SoilImage: soil[0].Image,
      MinAbs: minAbs, CC: soil[0].CapaciteChamp, Min: min
    }];
  }
  let seuil_min = Math.floor(100 * output[0].Min);
  let seuil_max = Math.floor(100 * output[0].CC);
  seuil_val_capt = seuil_min + (2 * (seuil_max - seuil_min)/3);
  return output;
}

const updatePotById = async(idPot, idSoil, idPlant) => {
  let pot = await connectKnex('Pot').where({Id : idPot}).select('*');
  if(idSoil === -1) {
    if(pot.length === 0){
      await connectKnex('Pot').insert({
        Id: idPot,
        IdPlant: idPlant
      })
    } else {
      await connectKnex('Pot').where({Id: pot[0].Id}).update({
        IdPlant: idPlant
      })
    }
  } else {
    if(pot.length === 0){
      await connectKnex('Pot').insert({
        Id: idPot,
        IdSoil: idSoil
      })
    } else {
      await connectKnex('Pot').where({Id: pot[0].Id}).update({
        IdSoil: idSoil
      })
    }
  }
}

