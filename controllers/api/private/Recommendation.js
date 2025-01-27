const RecommendationService = require('./../../../services/Recommendation');
const { verifyId } = require('./../../../utils/MongoUtils');

/**
 * Controlador utilizado para la creación, actualización y eliminación de 
 * recomendaciones
 */
const RecommendationController = {};

/**
 * Creación de recomendaciones
 * Esta función verifica que todos los campos requiriridos esten contenidos en el 
 * objeto recibido en la petición. Si la verificaión falla el servidor responde con
 * un código 400. Si la verificación es correcta se verifica si ya existe una recomendación
 * con el nombre indicado en la petición para evitar la duplicación de recomendaciones, en 
 * caso de exisitir duplicidad el servidor responde con un código 403. Si el título de la 
 * recomendación no ha sido utilizado se crea la recomendación, si la base de datos no puede
 * ser accedida por algún motivo el servidor responde con un código 503. Finalmente si todo 
 * es exitoso el servidor responde con un código 201 y el objeto de la recomendación creada.
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
RecommendationController.create = async (req, res) => {
  const recommendationValidated = RecommendationService.verifyContent(req.body);
  if (!recommendationValidated.success) {
    return res.status(400).json(recommendationValidated.content);
  }
  try {
    const recommendationExists = await RecommendationService.findByTitle(req.body);
    if (recommendationExists.success) {
      return res.status(403).json({
        error: 'Recommendation with indicated title already exists.'
      });
    }
    const recommendationCreated = await RecommendationService.create(req.body);
    if (!recommendationCreated.success) {
      return res.status(503).content(recommendationCreated.content);
    }
    return res.status(201).json(recommendationCreated.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    })
  }
}

/**
 * Actualizar recomendación
 * Esta función verifica que el _id proveído como parámetro en la ruta sea válido,
 * sino el servidor responde con un código 400. Si la verificación es exitosa se 
 * verifica que haya al menos un campo a actualizar sino hay ninguno el servidor
 * responde con un código 400. Si la verificación es exitosa se procede a verificar
 * que haya en la base de datos una recomendación con el _id indicado, si no existe el 
 * servidor responde con un código 404. Si el objeto existe en la base de datos se
 * procede a actualizarlo, pero si la base de datos no está disponible el servidor
 * responde con un código 503. En caso que la base de datos esté disponible y la 
 * acción se completa el servidor responde con un código 200 y el objeto actualizado
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
RecommendationController.update = async (req, res) => {
  const { _id } = req.params;

  if (!verifyId(_id)) {
    return res.status(400).json({
      error: 'Invalid id.'
    });
  }

  const verifiedFields = RecommendationService.verifyUpdate(req.body);

  if (!verifiedFields.success) {
    return res.status(400).json(verifiedFields.content);
  }

  try {
    const RecommendationExists = await RecommendationService.findOneById(_id);
    if (!RecommendationExists.success) {
      return res.status(404).json(RecommendationExists.content);
    }

    const RecommendationUpdated = await RecommendationService.updateOneById(RecommendationExists.content, verifiedFields.content);
    if (!RecommendationUpdated.success) {
      return res.status(503).json(RecommendationUpdated.content);
    }

    return res.status(200).json(RecommendationUpdated.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    })
  }
}

/**
 * Eliminar recomendación
 * Esta función verifica que haya en la base de datos una exhibición con el _id indicado,
 * si no existe el servidor responde con un código 404. Si el objeto existe en la base
 * de datos se procede a eliminarlo, pero si la base de datos no está disponible el 
 * serivodor responde con un código 503. En caso que la base de datos esté disponible 
 * y la acción se completa el servidor responde con un código 204 y un objeto vacío.
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
RecommendationController.remove = async (req, res) => {
  try {
    const recommendation = await RecommendationService.findOneById(req.params._id);
    if (!recommendation.success) {
      return res.status(404).json(recommendation.content);
    }
    const recommendationDeleted = await RecommendationService.remove(req.params._id);
    if (!recommendationDeleted.success) {
      return res.status(503).json(recommendationDeleted.content);
    }

    return res.status(204).json(recommendationDeleted.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    });
  }
}

module.exports = RecommendationController;