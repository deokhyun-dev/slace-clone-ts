// socket.io는 전역적인 성격을 띄기 때문에
// 특정 컴포넌트에 연결을 시켜놨다가
// 다른 컴포넌트에 다시 사용을 하면 연결이 끊길 수 있다.
// 그래서 하나의 컴포넌트에 만들기보다는
// 공용 훅스를 만들어 사용하는 것이 좋다

import io from 'socket.io-client';
import React, { useCallback } from 'react';
import axios from 'axios';

const backUrl = 'http://localhost:3095';
const sockets: { [key: string]: SocketIOClient.Socket } = {};
// 타입스크립트의 경우 빈 객체나 빈배열인 경우 타입을 선언해줘야함

const useSocket = (workspace?: string) => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
    }
  }, [workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }

  sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`);

  sockets[workspace].emit('hello', 'world');
  // ㄴ 'hello'는 이벤트명, 'world'는 데이터명 -> 헬로라는 이름으로 월드라는 데이터를 보냄

  // socket.on('message', (data) => {
  //   console.log(data);
  // });
  // on이라는 이벤트리스너를 붙이는 형태

  // emit으로 보내고, on으로 이벤트명 일치할 때 받고

  return [sockets[workspace], disconnect];
};

export default useSocket;
