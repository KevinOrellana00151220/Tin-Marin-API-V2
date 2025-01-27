const ExhibitionRoomService = require('./../../../services/ExhibitionRoom');

/**
 * Controlador utilizado para crear y consultar todos los caurtos de exhibiciones 
 * almacenadas en la base de datos.
 */
const ExhibitionRoomController = {};

/**
 * Creación de cuartos de exhibición
 * Esta función verifica que todos los campos requiriridos esten contenidos en el 
 * objeto recibido en la petición. Si la verificaión falla el servidor responde con
 * un código 400. Si la verificación es correcta se verifica si ya existe un código 
 * de cuarto de exhibiciones con el código indicado en la petición para evitar la 
 * duplicación de cuartos, en caso de exisitir duplicidad el servidor responde con
 * un código 403. Si el código no ha sido utilizado se crea el cuarto de exhibición,
 * si la base de datos no puede ser accedida por algún motivo el servidor responde 
 * con un código 503. Finalmente si todo es exitoso el servidor responde con un código
 * 201 y el objeto del cuarto de exhibición creado.
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
ExhibitionRoomController.create = async (req, res) => {
  const verifiedExhibitionRoom = ExhibitionRoomService.verifyFields(req.body);
  if (!verifiedExhibitionRoom.success) {
    return res.status(400).json(verifiedExhibitionRoom.content);
  }

  try {
    const { roomCode } = req.body;
    const exhibitionRoom = await ExhibitionRoomService.findOneExhibitionRoomByRoomCode(roomCode);
    if (exhibitionRoom.success) {
      return res.status(403).json({
        error: 'Specified room code has already been used.'
      });
    }

    const exhibitionRoomCreated = await ExhibitionRoomService.create(req.body);
    if (!exhibitionRoomCreated.success) {
      return res.status(503).json(exhibitionRoomCreated.content);
    }

    return res.status(201).json(exhibitionRoomCreated.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    });
  }
}

/**
 * Consulta de cuartos de exhibiciones
 * Esta función consulta por un cuarto de exhibición en específico, si no es encontrada el 
 * servidor responde con un código 404. Si es encontrado en el servidor responde con un 
 * código 200 y con una el objeto.
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
ExhibitionRoomController.find = async (req, res) => {
  const roomCode = req.query.roomCode;
  if (!roomCode) {
    try {
      const exhibitionRooms = await ExhibitionRoomService.findAll();
      if (!exhibitionRooms.success) {
        return res.status(404).json(exhibitionRooms.content);
      }
      return res.status(200).json(exhibitionRooms.content);
    } catch(error) {
      return res.status(500).json({
        error: 'Internal Server Error.'
      })
    }
  } else {
    try {
      const exhibitionRoom = await ExhibitionRoomService.findOneExhibitionRoomByRoomCode(roomCode);
      if (!exhibitionRoom.success) {
        return res.status(404).json(exhibitionRoom.content);
      }
      return res.status(200).json(exhibitionRoom.content);
    } catch(error) {
      return res.status(500).json({
        error: 'Internal Server Error.'
      });
    }
  }
}

module.exports = ExhibitionRoomController;