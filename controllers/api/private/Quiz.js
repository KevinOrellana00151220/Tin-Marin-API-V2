const QuizService = require('./../../../services/Quiz');

const QuizController = {};

QuizController.addNewQuiz = async (req, res) => {
  const fieldsValidation = QuizService.verifyFields(req.body);

  if (!fieldsValidation.success) {
    return res.status(400).json(fieldsValidation.content);
  }

  try {
    const quizCreated = await QuizService.create(req.body);

    if (!quizCreated.success) {
      return res.status(503).json(quizCreated.content);
    }

    return res.status(201).json(quizCreated.content);
  } catch (error) {
    return res.status(500).json({
      error: 'Internal Server Error'
    });
  }
}

QuizController.update = async (req, res) => {
  const { _id } = req.params;

  if (!verifyId(_id)) {
    return res.status(400).json({
      error: 'Invalid id.'
    });
  }

  const verifiedFields = QuizService.verifyUpdate(req.body);

  if (!verifiedFields.success) {
    return res.status(400).json(verifiedFields.content);
  }

  try {
    const quizExists = await QuizService.findOneById(_id);
    if (!quizExists.success) {
      return res.status(404).json(quizExists.content);
    }

    const quizUpdated = await QuizService.updateOneById(quizExists.content, verifiedFields.content);
    if (!quizUpdated.success) {
      return res.status(503).json(quizUpdated.content);
    }

    return res.status(200).json(quizUpdated.content);
  } catch (error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    })
  }
}

QuizController.remove = async (req, res) => {
  try {
    const quiz = await QuizService.findOneById(req.params._id);
    if (!quiz.success) {
      return res.status(404).json(quiz.content);
    }
    const quizDeleted = await QuizService.remove(req.params._id);
    if (!quizDeleted.success) {
      return res.status(503).json(quizDeleted.content);
    }

    return res.status(204).json(quizDeleted.content);
  } catch (error) {
    return res.status(500).json({
      error: 'Internal Server Error.'
    });
  }
}

module.exports = QuizController;