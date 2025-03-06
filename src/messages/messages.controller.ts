import { Controller, Get, Post } from '@nestjs/common';

@Controller('messages')
export class MessagesController {
  @Get()
  getMessages() {
    return 'List all messages';
  }

  @Get('/:id')
  getMessageById() {
    return 'Message by id';
  }

  @Post()
  createMessage() {
    return 'Message Created!';
  }
}
