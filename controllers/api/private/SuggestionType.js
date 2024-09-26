const SuggestionTypeService = require('./../../../services/SuggestionType');
const { verifyId } = require('./../../../utils/MongoUtils');

/**
 * Controlador utilizado para la creación, actualización y eliminación de 
 * tipos de sugerencias
 */
const SuggestionTypeController = {}

/**
 * Creación de tipos de sugerencias
 * Esta función verifica que todos los campos requiriridos esten contenidos en el 
 * objeto recibido en la petición. Si la verificaión falla el servidor responde con
 * un código 400. Si la verificación es correcta se verifica si ya existe una exhibición
 * con el nombre indicado en la petición para evitar la duplicación de nombres, en caso
 * de exisitir duplicidad el servidor responde con un código 403. Si el nombre del tipo
 * de sugerencia no ha sido utilizado se crea el tipo de sugerencia, si la base de datos 
 * no puede ser accedida por algún motivo el servidor responde con un código 503. Finalmente 
 * si todo es exitoso el servidor responde con un código 201 y el objeto del tipo de 
 * sugerencia creada.
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
SuggestionTypeController.create = async (req, res) => {
  const suggestionTypeValidated = SuggestionTypeService.verifyFields(req.body);
  if (!suggestionTypeValidated.success) {
    return res.status(400).json(suggestionTypeValidated.content);
  }

  try{
    const suggestionTypesExists = await SuggestionTypeService.findOneByName(req.body);
    if (suggestionTypesExists.success) {
      return res.status(403).json({
        error: 'Suggestion type already exists.'
      });
    }
    const suggestionTypeCreated = await SuggestionTypeService.create(req.body);
    if (!suggestionTypeCreated.success) {
      return res.status(503).json(suggestionTypeCreated.content);
    }
  
    return res.status(201).json(suggestionTypeCreated.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error'
    });
  }
}

/**
 * Actualizar tipo de segurencia
 * Esta función verifica que el _id proveído como parámetro en la ruta sea válido,
 * sino el servidor responde con un código 400. Si la verificación es exitosa se 
 * verifica que haya al menos un campo a actualizar sino hay ninguno el servidor
 * responde con un código 400. Si la verificación es exitosa se procede a verificar
 * que haya en la base de datos un tipo de sugerencia con el _id indicado, si no 
 * existe el servidor responde con un código 404. Si el objeto existe en la base de
 * datos se procede a actualizarlo, pero si la base de datos no está disponible el 
 * servidor responde con un código 503. En caso que la base de datos esté disponible
 * y la acción se completa el servidor responde con un código 200 y el objeto 
 * actualizado
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
SuggestionTypeController.update = async (req, res) => {
  const { _id } = req.params;

  if (!verifyId(_id)) {
    return res.status(400).json({
      error: 'Invalid id.'
    });
  }

  const verifiedFields = SuggestionTypeService.verifyUpdate(req.body);

  if (!verifiedFields.success) {
    return res.status(400).json(verifiedFields.content);
  }

  try {
    const SuggestionTypeExists = await SuggestionTypeService.findOneById(_id);
    if (!SuggestionTypeExists.success) {
      return res.status(404).json(SuggestionTypeExists.content);
    }

    const SuggestionTypeUpdated = await SuggestionTypeService.updateOneById(SuggestionTypeExists.content, verifiedFields.content);
    if (!SuggestionTypeUpdated.success) {
      return res.status(503).json(SuggestionTypeUpdated.content);
    }

    return res.status(200).json(SuggestionTypeUpdated.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    })
  }
}

/**
 * Eliminar pregunta frecuente
 * Esta función verifica que el _id proveído como parámetro en la ruta sea válido,
 * sino el servidor responde con un código 400. Si la verificación es exitosa se 
 * procede a verificar que haya en la base de datos una pregunta con el _id indicado,
 * si no existe el servidor responde con un código 404. Si el objeto existe en la base
 * de datos se procede a eliminarlo, pero si la base de datos no está disponible el 
 * serivodor responde con un código 503. En caso que la base de datos esté disponible 
 * y la acción se completa el servidor responde con un código 204 y un objeto vacío.
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
SuggestionTypeController.remove = async (req, res) => {
  if (!verifyId(req.params._id)) {
    res.status(400).json({
      error: 'Invalid id.'
    });
  }
  try {
    const suggestionType = await SuggestionTypeService.findOneById(req.params._id);
    if (!suggestionType.success) {
      return res.status(404).json(suggestionType.content);
    }
    const suggestionTypeDeleted = await SuggestionTypeService.remove(req.params._id);
    if (!suggestionTypeDeleted.success) {
      return res.status(503).json(suggestionTypeDeleted);
    }
    return res.status(204).json(suggestionTypeDeleted.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    });
  }
}

module.exports = SuggestionTypeController;