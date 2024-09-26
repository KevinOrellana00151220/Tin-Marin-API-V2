const QuizService = require('./../../../services/Quiz');

const QuizController = {};

QuizController.find = async (req, res) => {
    if (!req.query.question) {
        try {
            const quizFound = await QuizService.getAll();

            if (!quizFound.success) {
                return res.status(404).json(quizFound.content);
            }

            return res.status(200).json(quizFound.content);
        } catch (error) {
            return res.status(500).json({
                error: 'Internal Server Error.'
            })
        }
    } else {
        try {
            const quiz = await ExhibitionService.findByQuestion(req.query.question);
            if (!quiz.success) {
                return res.status(404).json(quiz.content);
            }

            return res.status(200).json(quiz.content);
        } catch (error) {
            res.status(500).json({
                error: 'Internal Server Error.'
            })
        }
    }
}

QuizController.findOneById = async (req, res) => {
    const { _id } = req.params;

    try {
        const quizFound = await QuizService.findOneById(_id);
        if (!quizFound.success) {
            return res.status(404).json(quizFound.content);
        }

        return res.status(200).json(quizFound.content);
    } catch (error) {
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

QuizController.findOneByExhibition = async (req, res) => {
    const { exhibition } = req.params;

    try {
        const quizFound = await QuizService.findOneByExhibition(exhibition);
        if (!quizFound.success) {
            return res.status(404).json(quizFound.content);
        }

        return res.status(200).json(quizFound.content);
    } catch (error) {
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

module.exports = QuizController;