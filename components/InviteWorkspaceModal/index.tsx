import Modal from '@components/Modal';
import { Label, Input, Button } from '@pages/SignUp/styles';
import React, { VFC, useState, useCallback } from 'react';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { IChannel, IUser } from '@typings/db';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteWorkspaceModal: (flag: boolean) => void;
}

const InviteWorkspaceModal: VFC<Props> = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { workspace } = useParams<{ workspace: string }>();

  const { data: userData } = useSWR<IUser>('http://localhost:3095/api/users', fetcher);

  const { data, error, mutate } = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/members` : null,
  );

  const onInviteMember = useCallback((e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:3095/api//workspaces/${workspace}/members`)
      .then((res) => {
        mutate(res.data, false);
        setNewMember('');
        setShowInviteWorkspaceModal(false);
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, []);

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label>
          <span>이메일</span>
          <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteWorkspaceModal;
