const QuizModel = require('./../models/Quiz');

const QuizService = {};

QuizService.verifyFields = ({ question, options, correct_option, exhibition }) => {
    let serviceResponse = {
        success: true,
        content: {}
    }

    if (!question || !options || !correct_option || !exhibition) {
        serviceResponse = {
          success: false,
          content: {
            error: "Missing required fields."
          }
        }
      }

    return serviceResponse;
}

QuizService.verifyUpdate = ({ question, options, correct_option, exhibition }) => {
    let serviceResponse = {
        success: true,
        content: {}
    }

    if (!question && !options && !correct_option && !exhibition ) {
        serviceResponse = {
          success: false,
          content: {
            error: "No changes to make."
          }
        }
        return serviceResponse;
    }

    if (question) serviceResponse.content.question = question;
    if (options) serviceResponse.content.options = options;
    if (correct_option) serviceResponse.content.correct_option = correct_option;
    if (exhibition) serviceResponse.content.exhibition = exhibition;

    return serviceResponse;
}

QuizService.create = async ({ question, options, correct_option, exhibition }) => {
    let serviceResponse = {
        success: true,
        content: {}
      }

      try {
        const newQuiz = new QuizModel({
            question,
            options,
            correct_option,
            exhibition
        });

        const newQuizWasCreated = await newQuiz.save();
        if (!newQuizWasCreated) {
            serviceResponse = {
                success: false,
                  content: {
                    error: "Quiz could not be created."
                  }
                }
        } else {
              serviceResponse.content = newQuizWasCreated;
        }
        
        return serviceResponse;
    } catch(error) {
        throw new Error("Internal Server Error.")
    }
}

QuizService.findOneByQuestion = async ({ question }) => {
  let serviceResponse = {
    success: true,
    content: {}
  }

  try{
    const quiz = await QuizModel.findOne({ question: question }).exec();
    if (!quiz) {
      serviceResponse = {
        success: false,
        content: {
          error: 'Quiz not found.'
        }
      }
    } else {
      serviceResponse.content = quiz;
    }

    return serviceResponse;
  } catch(error) {
    throw new Error('Internal Server Error.')
  }
}

QuizService.getAll = async() => {
    let serviceResponse = {
        success: true,
        content: {}
      }
    
      try {
        const quizzes = await QuizModel.find();
        if (!quizzes) {
          serviceResponse = {
            success: false,
            content: {
              error: 'No quiz found.'
            }
          }
        } else {
          serviceResponse.content = quizzes;
        }
    
        return serviceResponse;
      } catch(error) {
        throw new Error('Internal Server Error')
      }
}

QuizService.findOneById = async (_id) => {
  let serviceResponse = {
    success: true,
    content: {}
  }

  try {
    const quiz = await QuizModel.findOne({ _id: _id }).exec();
    if (!quiz) {
      serviceResponse = {
        success: false,
        content: {
          error: 'Quiz not found.'
        }
      }
    } else {
      serviceResponse.content = quiz;
    }

    return serviceResponse;
  } catch(error) {
    throw new Error('Internal Server Error');
  }
}

QuizService.findOneByExhibition = async ({ exhibition }) => {
  let serviceResponse = {
    success: true,
    content: {}
  }

  try{
    const quiz = await QuizModel.findOne({ exhibition: exhibition }).exec();
    if (!quiz) {
      serviceResponse = {
        success: false,
        content: {
          error: 'Quiz not found.'
        }
      }
    } else {
      serviceResponse.content = quiz;
    }

    return serviceResponse;
  } catch(error) {
    throw new Error('Internal Server Error.')
  }
}

QuizService.updateOneById = async (quiz, newContent) => {
  let serviceResponse = {
    success: true,
    content: {}
  }

  try {
    const updatedQuiz = await QuizModel.findByIdAndUpdate(quiz._id, { ...newContent });
    if (!updatedQuiz) {
      serviceResponse = {
        success: false,
        content: {
          error: 'Something went wrong.'
        }
      }
    } else {
      serviceResponse.content = await QuizModel.findById(quiz._id).exec();
    }

    return serviceResponse;
  } catch(error) {
    throw new Error('Internal Server Error');
  }
}

QuizService.remove = async (_id) => {
    let serviceResponse = {
        success: true,
        content: {}
      }
    
      try {
        const quizDeleted = await QuizModel.findByIdAndDelete(_id).exec();
        if (!quizDeleted) {
          serviceResponse = {
            success: false,
            content: {
              error: 'Something went wrong. Try again later.'
            }
          }
        }
    
        return serviceResponse;
      } catch(error) {
        throw new Error('Interal Server Error');
      }
}

module.exports = QuizService;