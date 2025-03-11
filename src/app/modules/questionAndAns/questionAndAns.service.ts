import { Room } from './../room/room.model';
import openai from '../../../shared/openAi';
import { IQuestionAndAns } from './questionAndAns.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import moment from 'moment';
import { QuestionAndAns } from './questionAndAns.model';

const createChat = async (payload: IQuestionAndAns) => {
  // Step 1: Check if the question is business-related
  const checkResult = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'Determine if the user\'s question is related to business. Respond only with "yes" or "no".',
      },
      { role: 'user', content: payload.question },
    ],
  });

  const isBusinessRelated = checkResult.choices[0].message?.content
    ?.trim()
    .toLowerCase();

  if (isBusinessRelated !== 'yes') {
    return 'I only answer business-related questions.';
  }

  // Step 2: Generate a business-related response
  const result = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'You are an AI expert in business strategy. Answer business-related questions only.',
      },
      { role: 'user', content: payload.question },
    ],
  });

  let roomId;
  let room;

  if (payload.room) {
    room = await Room.findOne({ roomName: payload.room });

    if (room) {
      roomId = room.roomName;
    } else {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found!');
    }
  } else if (!payload.createRoom) {
    room = await Room.findOne({ user: payload.user }).sort({ createdAt: -1 });
    if (room) {
      roomId = room.roomName;
    }
  }
  console.log(payload.createRoom);
  if (!room || payload.createRoom) {
    const formattedDate = moment().format('HH:mm:ss');
    room = await Room.create({
      user: payload.user,
      roomName: payload.question + ' ' + formattedDate,
    });
  }

  const answer = result.choices[0].message?.content;

  const value = {
    question: payload.question,
    answer: answer,
    room: room._id,
    user: payload.user,
    createRoom: payload.createRoom,
  };

  const res = await QuestionAndAns.create(value);
  return res;
};

export const QuestionAndAnsService = {
  createChat,
};
