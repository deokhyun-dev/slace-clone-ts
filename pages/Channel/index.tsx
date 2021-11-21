import React, { useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { Container, Header } from '@pages/Channel/styles';
import useInput from '@hooks/useInput';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { IDM } from '@typings/db';

const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput('');
  const params = useParams();
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: myData } = useSWR('/api/users', fetcher, {
    dedupingInterval: 2000,
  });
  // const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  // const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
  //   `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
  // );

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      console.log(chat);
      if (chat?.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
            content: chat,
          })
          .then((res) => {
            setChat('');
            // mutateChat();
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
            console.dir(error.response);
          });
      }
    },
    [chat],
  );

  return (
    <Container>
      <Header> 채널페이지</Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} placeholder="채팅을 입력해주세요" />
    </Container>
  );
};

export default Channel;
