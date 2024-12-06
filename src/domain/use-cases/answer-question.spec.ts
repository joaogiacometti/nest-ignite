import { test } from 'vitest';
import { AnswerQuestionUseCase } from './answer-question';

test('create answer', () => {
  const answerQuestionUseCase = new AnswerQuestionUseCase();

  const answer = answerQuestionUseCase.execute({
    content: 'new answer',
    instructorId: '1',
    questionId: '1',
  });

  expect(answer.content).toBe('new answer');
});
