const express = require('express');
const router = express.Router();

const QuizController = require('./../../../controllers/api/private/Quiz');

router.post('/', QuizController.addNewQuiz);
router.put('/:_id', QuizController.update);
router.delete('/:_id', QuizController.remove);

module.exports = router;