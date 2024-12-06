import { Answer } from '../entities/answer';

interface Request {
  instructorId: string;
  questionId: string;
  content: string;
}

export class AnswerQuestionUseCase {
  execute({ content }: Request): Answer {
    const answer = new Answer(content);

    return answer;
  }
}
