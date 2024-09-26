const RecommendedWebsiteService = require('./../../../services/RecommendedWebsite');
const { verifyId } = require('./../../../utils/MongoUtils');

/**
 * Controlador utilizado para la creación, actualización y eliminación de 
 * sitios web recomendados
 */
const RecommendedWebsiteController = {};

/**
 * Creación de sitios web recomendados
 * Esta función verifica que todos los campos requiriridos esten contenidos en el 
 * objeto recibido en la petición. Si la verificaión falla el servidor responde con
 * un código 400. Si la verificación es correcta se crea el sitio web recomendado, si
 * la base de datos no puede ser accedida por algún motivo el servidor responde con un 
 * código 503. Finalmente si todo es exitoso el servidor responde con un código 201 y 
 * el objeto de la exhibición creada.
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
RecommendedWebsiteController.create = async (req, res) => {
  const recommendedWebsiteVerified = RecommendedWebsiteService.verifyFields(req.body);
  if (!recommendedWebsiteVerified.success) {
    return res.status(400).json(recommendedWebsiteVerified.content);
  }

  try {
    const recommendedWebsiteSaved = await RecommendedWebsiteService.create(req.body);
    if (!recommendedWebsiteSaved.success) {
      return res.status(503).json(recommendedWebsiteSaved.content);
    }
    return res.status(201).json(recommendedWebsiteSaved.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    })
  }
}

/**
 * Actualizar sitio web recomendado
 * Esta función verifica que el _id proveído como parámetro en la ruta sea válido,
 * sino el servidor responde con un código 400. Si la verificación es exitosa se 
 * verifica que haya al menos un campo a actualizar sino hay ninguno el servidor
 * responde con un código 400. Si la verificación es exitosa se procede a verificar
 * que haya en la base de datos un sitio web recomendado con el _id indicado, si no
 * existe el servidor responde con un código 404. Si el objeto existe en la base de
 * datos se procede a actualizarlo, pero si la base de datos no está disponible el
 * servidor responde con un código 503. En caso que la base de datos esté disponible
 * y la acción se completa el servidor responde con un código 200 y el objeto 
 * actualizado
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
RecommendedWebsiteController.update = async (req, res) => {
  const { _id } = req.params;

  if (!verifyId(_id)) {
    return res.status(400).json({
      error: 'Invalid id.'
    });
  }

  const verifiedFields = RecommendedWebsiteService.verifyUpdate(req.body);

  if (!verifiedFields.success) {
    return res.status(400).json(verifiedFields.content);
  }

  try {
    const RecommendedWebsiteExists = await RecommendedWebsiteService.findOneById(_id);
    if (!RecommendedWebsiteExists.success) {
      return res.status(404).json(RecommendedWebsiteExists.content);
    }

    const RecommendedWebsiteUpdated = await RecommendedWebsiteService.updateOneById(RecommendedWebsiteExists.content, verifiedFields.content);
    if (!RecommendedWebsiteUpdated.success) {
      return res.status(503).json(RecommendedWebsiteUpdated.content);
    }

    return res.status(200).json(RecommendedWebsiteUpdated.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    })
  }
}

/**
 * Eliminar sitio web recomendado
 * Esta función verifica que haya en la base de datos un sitio web recomendado con el _id 
 * indicado, si no existe el servidor responde con un código 404. Si el objeto existe en
 * la base de datos se procede a eliminarlo, pero si la base de datos no está disponible el 
 * serivodor responde con un código 503. En caso que la base de datos esté disponible y la
 * acción se completa el servidor responde con un código 204 y un objeto vacío.
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
RecommendedWebsiteController.remove = async (req, res) => {
  try {
    const recommendedWebsite = await RecommendedWebsiteService.findOneById(req.params._id);
    if (!recommendedWebsite.success) {
      return res.status(404).json(recommendedWebsite.content);
    }
    const recommendedWebsiteDeleted = await RecommendedWebsiteService.remove(req.params._id);
    if (!recommendedWebsiteDeleted.success) {
      return res.status(503).json(recommendedWebsiteDeleted.content);
    }

    return res.status(204).json(recommendedWebsiteDeleted.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    });
  }
}

module.exports = RecommendedWebsiteController;