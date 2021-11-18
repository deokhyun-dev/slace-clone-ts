import React, { useCallback, useState } from 'react';
import { Header, Form, Label, Input, Error, Button, LinkContainer } from '@pages/SignUp/styles';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const LogIn = () => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 2000,
  });
  // ㄴ swr은 get요청에만 먹힘
  // useSWR 파라미터 1. api주소 2. 데이터 처리 미들웨어
  // SWR은 자동으로 요청을 다시 보내준다.
  // 그래서 다른 탭 갔다가 돌아왔을 때 데이터를 최신 상태로 유지할 수 있다.

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logInError, setLogInError] = useState(false);

  const onChangeEmail = (e: any) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: any) => {
    setPassword(e.target.value);
  };

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          'http://localhost:3095/api/users/login',
          { email, password },
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          mutate(response.data);
        })
        .catch((error) => {
          console.log(error.response);
          setLogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password],
  );
  // withCredentials: true 설정을 해줘야 쿠키가 생성됨

  if (data === undefined) {
    return <div>로딩중....</div>;
  }

  if (data) {
    return <Redirect to="/workspace/channel" />;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
