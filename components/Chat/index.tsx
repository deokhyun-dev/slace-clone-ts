import { IDM } from '@typings/db';
import React, { VFC } from 'react';
import { ChatWrapper } from '@components/Chat/styles';

interface Props {
  data: IDM;
}

const Chat: VFC<Props> = ({ data }) => {
  console.log(data);
  return <ChatWrapper>챗챗</ChatWrapper>;
};

export default Chat;
