import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import useSWR from 'swr';
import {
  Channels,
  Chats,
  Header,
  MenuScroll,
  ProfileImg,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessge'));

const Workspace: FC = ({ children }) => {
  // ㄴ children을 쓰는 컴포넌트는 FC를 react에서 불러와서 붙여줘야함
  // ㄴ children을 안쓰는 컴포넌트는 VFC을 붙여줘야함
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 2000,
  });
  console.log(data);
  const onLogOut = () => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        mutate(false, false);
      })
      .catch((res) => {
        console.log(res.response);
      });
  };

  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <button onClick={onLogOut}>로그아웃</button>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'robohash' })} alt={data.email} />
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>Menu Scroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/channel" exact component={Channel} />
            <Route path="/workspace/dm" exact component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
