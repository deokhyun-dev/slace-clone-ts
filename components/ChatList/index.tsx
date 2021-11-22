import React, { VFC } from 'react';
import { ChatZone, Section } from '@components/ChatList/styles';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import fetcher from '@utils/fetcher';
import { IDM } from '@typings/db';
import Chat from '@components/Chat';

interface Props {
  chatData?: IDM[];
}

const ChatList: VFC<Props> = ({ chatData }) => {
  return (
    <ChatZone>
      {chatData?.map((chat) => {
        return <Chat data={chat} />;
      })}
    </ChatZone>
  );
};

export default ChatList;
