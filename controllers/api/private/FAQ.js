const FAQService = require('./../../../services/FAQ');
const { verifyId } = require('./../../../utils/MongoUtils');

/**
 * Controlador utilizado para la creación, actualización y eliminación de 
 * preguntas frecuentes
 */
const FAQController = {};

/**
 * Creación de pregunta frecuente
 * Esta función verifica que todos los campos requiriridos esten contenidos en el 
 * objeto recibido en la petición. Si la verificaión falla el servidor responde con
 * un código 400. Si la verificación es correcta se verifica si ya existe una pregunta
 * con la forma indicado en la petición para evitar la duplicación de preguntas, en 
 * caso de exisitir duplicidad el servidor responde con un código 403. Si la pregunta 
 * no ha sido utilizado se crea la pregunta con su respuesta, si la base de datos no 
 * puede ser accedida por algún motivo el servidor responde con un código 503. Finalmente 
 * si todo es exitoso el servidor responde con un código 201 y el objeto de la pregunta
 * frecuente creada.
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
FAQController.create = async (req, res) => {
  const FAQVerified = FAQService.verifyFields(req.body);
  if (!FAQVerified.success) {
    return res.status(400).json(FAQVerified.content);
  }
  try {
    const FAQExists = await FAQService.findByQuestion(req.body);
    if (FAQExists.success) {
      return res.status(403).json({
        error: 'FAQ with indicated question already exists.'
      })
    }
    const FAQSaved = await FAQService.create(req.body);
    if (!FAQSaved.success) {
      return res.status(503).json(FAQSaved.content);
    }

    return res.status(201).json(FAQSaved.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    });
  }
}

/**
 * Actualizar pregunta frecuente
 * Esta función verifica que el _id proveído como parámetro en la ruta sea válido,
 * sino el servidor responde con un código 400. Si la verificación es exitosa se 
 * verifica que haya al menos un campo a actualizar sino hay ninguno el servidor
 * responde con un código 400. Si la verificación es exitosa se procede a verificar
 * que haya en la base de datos una pregunta con el _id indicado, si no existe el 
 * servidor responde con un código 404. Si el objeto existe en la base de datos se
 * procede a actualizarlo, pero si la base de datos no está disponible el servidor
 * responde con un código 503. En caso que la base de datos esté disponible y la 
 * acción se completa el servidor responde con un código 200 y el objeto actualizado
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
FAQController.update = async (req, res) => {
  const { _id } = req.params;

  if (!verifyId(_id)) {
    return res.status(400).json({
      error: 'Invalid id.'
    });
  }

  const verifiedFields = FAQService.verifyUpdate(req.body);

  if (!verifiedFields.success) {
    return res.status(400).json(verifiedFields.content);
  }

  try {
    const FAQExists = await FAQService.findOneById(_id);
    if (!FAQExists.success) {
      return res.status(404).json(FAQExists.content);
    }

    const FAQUpdated = await FAQService.updateOneById(FAQExists.content, verifiedFields.content);
    if (!FAQUpdated.success) {
      return res.status(503).json(FAQUpdated.content);
    }

    return res.status(200).json(FAQUpdated.content);
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
FAQController.remove = async (req, res) => {
  try {
    const faq = await FAQService.findOneById(req.params._id);
    if (!faq.success) {
      return res.status(404).json(faq.content);
    }
    const faqDeleted = await FAQService.remove(req.params._id);
    if (!faqDeleted.success) {
      return res.status(503).json(faqDeleted.content);
    }

    return res.status(204).json(faqDeleted.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    });
  }
}

module.exports = FAQController;