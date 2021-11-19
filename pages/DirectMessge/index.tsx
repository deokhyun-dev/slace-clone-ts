import React from 'react';
import { Container, Header } from '@pages/DirectMessge/styles';
import useSWR from 'swr';
import gravatar from 'gravatar';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router-dom';

const DirectMessage = () => {
  const { data: myData } = useSWR('/api/users', fetcher, {
    dedupingInterval: 2000,
  });

  const params = useParams();
  console.log(params);
  const { workspace, id } = useParams<{ workspace: string; id: string }>();

  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  console.log(userData);

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(myData.email, { s: '24px', d: 'robohash' })} alt={myData.email} />
        <span>{myData.nickname}</span>
      </Header>
    </Container>
  );
};

export default DirectMessage;
