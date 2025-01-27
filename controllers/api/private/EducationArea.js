const EducationAreaService = require('./../../../services/EducationArea');
const { verifyId } = require('./../../../utils/MongoUtils');

/**
 * Controlador utilizado para la creación, actualización y eliminación de áreas
 * de educación.
 */
const EducationAreaController = {};

/**
 * Creación de área de educación
 * Esta función verifica que todos los campos requiriridos esten contenidos en el 
 * objeto recibido en la petición. Si la verificaión falla el servidor responde con
 * un código 400. Si la verificación es correcta se verifica si ya existe un área de
 * educación con el nombre indicado en la petición para evitar la duplicación de 
 * nombres. Si el nombre del área de educación no ha sido utilizado se crea el área
 * de educación, si la base de datos no puede ser accedida por algún motivo el
 * servidor responde con un código 503. Finalmente si todo es exitoso el servidor
 * responde con un código 201 y el objeto del área de educación creada.
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
EducationAreaController.create = async (req, res) => {
  const educationAreaVerified = EducationAreaService.verifyFields(req.body);
  if (!educationAreaVerified.success) {
    return res.status(400).json(educationAreaVerified.content);
  }

  try {
    const educationAreaExists = await EducationAreaService.findOneByName(req.body);
    if (educationAreaExists.success) {
      return res.status(403).json({
        error: 'Education area already exists.'
      })
    }
    
    const educationAreaSaved = await EducationAreaService.create(req.body);
    if (!educationAreaSaved.success) {
      return res.status(503).json(educationAreaSaved.content);
    }

    return res.status(201).json(educationAreaSaved.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    })
  }
}

/**
 * Actualizar área de educación
 * Esta función verifica que el _id proveído como parámetro en la ruta sea válido,
 * sino el servidor responde con un código 400. Si la verificación es exitosa se 
 * verifica que haya al menos un campo a actualizar sino hay ninguno el servidor
 * responde con un código 400. Si la verificación es exitosa se procede a verificar
 * que haya en la base de datos un área de educación con el _id indicado, si no existe
 * el servidor responde con un código 404. Si el objeto existe en la base de datos se
 * procede a actualizarlo, pero si la base de datos no está disponible el servidor
 * responde con un código 503. En caso que la base de datos esté disponible y el registro
 * se completa el servidor responde con un código 200 y el objeto actualizado
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
EducationAreaController.update = async (req, res) => {
  const { _id } = req.params;

  if (!verifyId(_id)) {
    return res.status(400).json({
      error: 'Invalid id.'
    });
  }

  const verifiedFields = EducationAreaService.verifyUpdate(req.body);

  if (!verifiedFields.success) {
    return res.status(400).json(verifiedFields.content);
  }

  try {
    const educationAreaExists = await EducationAreaService.findOneById(_id);
    if (!educationAreaExists.success) {
      return res.status(404).json(educationAreaExists.content);
    }

    const educationAreaUpdated = await EducationAreaService.updateOneById(educationAreaExists.content, verifiedFields.content);
    if (!educationAreaUpdated.success) {
      return res.status(503).json(educationAreaUpdated.content);
    }

    return res.status(200).json(educationAreaUpdated.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    })
  }
}

/**
 * Eliminar área de educación
 * Esta función verifica que el _id proveído como parámetro en la ruta sea válido,
 * sino el servidor responde con un código 400. Si la verificación es exitosa se 
 * procede a verificar que haya en la base de datos un área de educación con el _id
 * indicado, si no existe el servidor responde con un código 404. Si el objeto existe
 * en la base de datos se procede a eliminarlo, pero si la base de datos no está 
 * disponible el serivodor responde con un código 503. En caso que la base de datos 
 * esté disponible y la acción se completa el servidor responde con un código 200 
 * y un objeto vacío.
 * 
 * @param {Object} petición realizada al servidor
 * @param {Object} respuesta a la petición realizada
 */
EducationAreaController.remove = async (req, res) => {
  if (!verifyId(req.params._id)) {
    return res.status(400).json({
      error: 'Invalid id.'
    });
  }
  try {
    const educationArea = await EducationAreaService.findOneById(req.params._id);
    if (!educationArea.success) {
      return res.status(404).json(educationArea.content);
    }
    const educationAreaDeleted = await EducationAreaService.remove(req.params._id);
    if (!educationAreaDeleted.success) {
      return res.status(503).json(educationAreaDeleted.content);
    }

    return res.status(204).json(educationAreaDeleted.content);
  } catch(error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    })
  }
}

module.exports = EducationAreaController;