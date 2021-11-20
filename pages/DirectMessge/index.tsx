import React, { useCallback } from 'react';
import { Container, Header } from '@pages/DirectMessge/styles';
import useSWR from 'swr';
import gravatar from 'gravatar';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router-dom';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';

const DirectMessage = () => {
  const params = useParams();
  console.log(params);
  const { workspace, id } = useParams<{ workspace: string; id: string }>();

  const { data: myData } = useSWR('/api/users', fetcher, {
    dedupingInterval: 2000,
  });
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);

  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = useCallback(
    (e) => {
      console.log('클릭');
      e.preventDefault();
      if (chat?.trim()) {
        console.log(chat, '트림안');
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then((res) => {
            console.log(res);
            setChat('');
          })
          .catch((error) => {
            console.dir(error.response);
          });
      }
    },
    [chat],
  );

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'robohash' })} alt={userData.email} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} placeholder="채팅을 입력해주세요" />
    </Container>
  );
};

export default DirectMessage;
