const ExhibitionService = require('./../../../services/Exhibition');
const { verifyId } = require('./../../../utils/MongoUtils');

/**
 * Controlador utilizado para la creación, actualización y eliminación de exhibiciones
 */
const ExhibitionController = {};

/**
 * Creación de exhibiciones
 * Esta función verifica que todos los campos requiriridos esten contenidos en el 
 * objeto recibido en la petición. Si la verificaión falla el servidor responde con
 * un código 400. Si la verificación es correcta se verifica si ya existe una exhibición
 * con el nombre indicado en la petición para evitar la duplicación de nombres, en caso
 * de exisitir duplicidad el servidor responde con un código 403. Si el nombre de la 
 * exhibición no ha sido utilizado se crea la exhibición, si la base de datos no puede 
 * ser accedida por algún motivo el servidor responde con un código 503. Finalmente si
 * todo es exitoso el servidor responde con un código 201 y el objeto de la exhibición
 * creada.
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
ExhibitionController.addNewExhibition = async (req, res) => {
  const fieldsValidation = ExhibitionService.verifyFields(req.body);

  if (!fieldsValidation.success) {
    return res.status(400).json(fieldsValidation.content);
  }

  try {
    const exhibitionExists = await ExhibitionService.findOneByName(req.body);
    if (exhibitionExists.success) {
      return res.status(403).json({
        error: 'Exhibition with indicated name already exists.'
      });
    }
    
    const exhibitionCreated = await ExhibitionService.create(req.body);

    if (!exhibitionCreated.success) {
      return res.status(503).json(exhibitionCreated.content);
    }

    return res.status(201).json(exhibitionCreated.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error'
    });
  }
}

/**
 * Actualizar exhibición
 * Esta función verifica que el _id proveído como parámetro en la ruta sea válido,
 * sino el servidor responde con un código 400. Si la verificación es exitosa se 
 * verifica que haya al menos un campo a actualizar sino hay ninguno el servidor
 * responde con un código 400. Si la verificación es exitosa se procede a verificar
 * que haya en la base de datos una exhibición con el _id indicado, si no existe el 
 * servidor responde con un código 404. Si el objeto existe en la base de datos se
 * procede a actualizarlo, pero si la base de datos no está disponible el servidor
 * responde con un código 503. En caso que la base de datos esté disponible y la 
 * acción se completa el servidor responde con un código 200 y el objeto actualizado
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
ExhibitionController.update = async (req, res) => {
  const { _id } = req.params;

  if (!verifyId(_id)) {
    return res.status(400).json({
      error: 'Invalid id.'
    });
  }

  const verifiedFields = ExhibitionService.verifyUpdate(req.body);

  if (!verifiedFields.success) {
    return res.status(400).json(verifiedFields.content);
  }

  try {
    const exhibitionExists = await ExhibitionService.findOneById(_id);
    if (!exhibitionExists.success) {
      return res.status(404).json(exhibitionExists.content);
    }

    const exhibitionUpdated = await ExhibitionService.updateOneById(exhibitionExists.content, verifiedFields.content);
    if (!exhibitionUpdated.success) {
      return res.status(503).json(exhibitionUpdated.content);
    }

    return res.status(200).json(exhibitionUpdated.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    })
  }
}

/**
 * Eliminar exhibición
 * Esta función verifica que el _id proveído como parámetro en la ruta sea válido,
 * sino el servidor responde con un código 400. Si la verificación es exitosa se 
 * procede a verificar que haya en la base de datos una exhibición con el _id indicado,
 * si no existe el servidor responde con un código 404. Si el objeto existe en la base
 * de datos se procede a eliminarlo, pero si la base de datos no está disponible el 
 * serivodor responde con un código 503. En caso que la base de datos esté disponible 
 * y la acción se completa el servidor responde con un código 204 y un objeto vacío.
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
ExhibitionController.remove = async (req, res) => {
  try {
    const exhibition = await ExhibitionService.findOneById(req.params._id);
    if (!exhibition.success) {
      return res.status(404).json(exhibition.content);
    }
    const exhibitionDeleted = await ExhibitionService.remove(req.params._id);
    if (!exhibitionDeleted.success) {
      return res.status(503).json(exhibitionDeleted.content);
    }

    return res.status(204).json(exhibitionDeleted.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    });
  }
}

module.exports = ExhibitionController;