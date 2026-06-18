import QuizPaper from '../models/QuizPaper.js';
import UserQuizAttempt from '../models/UserQuizAttempt.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { upsertActivity } from '../services/activityService.js';
import { getLocalDateKey } from '../utils/dateKey.js';

const supportedSubjects = [
  {
    subject: 'oop',
    title: 'Object Oriented Programming',
    description: 'Inheritance, polymorphism, abstraction, and core OOP fundamentals.'
  },
  {
    subject: 'os',
    title: 'Operating Systems',
    description: 'Processes, scheduling, memory management, and synchronization.'
  },
  {
    subject: 'dbms',
    title: 'Database Management Systems',
    description: 'Normalization, SQL, transactions, and relational theory.'
  },
  {
    subject: 'cn',
    title: 'Computer Networks',
    description: 'OSI model, TCP/IP, routing, and network fundamentals.'
  }
];

export const getQuizList = asyncHandler(async (req, res) => {
  const quizzes = await QuizPaper.find({}).sort({ updatedAt: -1, createdAt: -1 });

  const summaries = supportedSubjects.map((subject) => {
    const quiz = quizzes.find((item) => item.subject === subject.subject);

    return {
      ...subject,
      generated: !!quiz,
      quizId: quiz?._id || null,
      title: quiz?.title || subject.title,
      version: quiz?.version || null,
      generatedAt: quiz?.generatedAt || null,
      questionCount: quiz?.questions?.length || 0
    };
  });

  return res.status(200).json(
    new ApiResponse(200, summaries, 'Quiz list fetched successfully')
  );
});

export const getQuizBySubject = asyncHandler(async (req, res) => {
  const { subject } = req.params;

  if (!['oop', 'os', 'dbms', 'cn'].includes(subject)) {
    throw new ApiError(400, 'Invalid subject');
  }

  const quiz = await QuizPaper.findOne({ subject });

  if (!quiz) {
    throw new ApiError(404, 'Quiz not found for this subject');
  }

  const safeQuestions = quiz.questions.map((q, idx) => ({
    index: idx,
    question: q.question,
    options: q.options,
    difficulty: q.difficulty
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        quizId: quiz._id,
        subject: quiz.subject,
        title: quiz.title,
        version: quiz.version,
        questions: safeQuestions
      },
      'Quiz fetched successfully'
    )
  );
});

export const submitQuizAnswers = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;

  if (!quizId || !answers || !Array.isArray(answers)) {
    throw new ApiError(400, 'quizId and answers array are required');
  }

  const quiz = await QuizPaper.findById(quizId);

  if (!quiz) {
    throw new ApiError(404, 'Quiz not found');
  }

  const mappedAnswers = quiz.questions.map((q, idx) => {
    const userAnswer = answers.find((a) => a.questionIndex === idx);

    const selectedIndex =
      userAnswer && typeof userAnswer.selectedIndex === 'number'
        ? userAnswer.selectedIndex
        : null;

    const isCorrect = selectedIndex === q.correctIndex;

    return {
      questionIndex: idx,
      selectedIndex,
      correctIndex: q.correctIndex,
      isCorrect
    };
  });

  const correctCount = mappedAnswers.filter((a) => a.isCorrect).length;
  const totalQuestions = quiz.questions.length;
  const wrongCount = totalQuestions - correctCount;
  const score = Math.round((correctCount / totalQuestions) * 100);

  const attempt = await UserQuizAttempt.findOneAndUpdate(
    {
      user: req.user.id,
      quizPaper: quiz._id
    },
    {
      user: req.user.id,
      quizPaper: quiz._id,
      subject: quiz.subject,
      date: getLocalDateKey(),
      answers: mappedAnswers,
      score,
      totalQuestions,
      correctCount,
      wrongCount
    },
    { new: true, upsert: true }
  );

  await upsertActivity({ userId: req.user.id, quizInc: 1, date: getLocalDateKey() });

  const detailedQuestions = quiz.questions.map((q, idx) => {
    const ans = mappedAnswers.find((a) => a.questionIndex === idx);

    return {
      index: idx,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      correctIndex: q.correctIndex,
      selectedIndex: ans.selectedIndex,
      isCorrect: ans.isCorrect,
      explanation: q.explanation
    };
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        attemptId: attempt._id,
        quizId: quiz._id,
        subject: quiz.subject,
        score,
        correctCount,
        wrongCount,
        totalQuestions,
        questions: detailedQuestions
      },
      'Quiz submitted successfully'
    )
  );
});

export const getMyQuizAttempts = asyncHandler(async (req, res) => {
  const attempts = await UserQuizAttempt.find({ user: req.user.id })
    .populate('quizPaper', 'subject title version generatedAt')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, attempts, 'Quiz attempts fetched successfully'));
});

export const getQuizAttemptById = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const attempt = await UserQuizAttempt.findOne({
    _id: attemptId,
    user: req.user.id
  }).populate('quizPaper', 'subject title version generatedAt questions');

  if (!attempt) {
    throw new ApiError(404, 'Quiz attempt not found');
  }

  const quiz = attempt.quizPaper;

  const review = quiz.questions.map((q, idx) => {
    const ans = attempt.answers.find((a) => a.questionIndex === idx);

    return {
      index: idx,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      correctIndex: q.correctIndex,
      selectedIndex: ans?.selectedIndex ?? null,
      isCorrect: ans?.isCorrect ?? false,
      explanation: q.explanation
    };
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        attemptId: attempt._id,
        quizPaper: {
          id: quiz._id,
          subject: quiz.subject,
          title: quiz.title,
          version: quiz.version
        },
        score: attempt.score,
        correctCount: attempt.correctCount,
        wrongCount: attempt.wrongCount,
        totalQuestions: attempt.totalQuestions,
        answers: attempt.answers,
        review
      },
      'Quiz attempt fetched successfully'
    )
  );
});