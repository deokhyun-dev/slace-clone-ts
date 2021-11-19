import useInput from '@hooks/useInput';
import Modal from '@components/Modal';
import { Label, Input, Button } from '@pages/SignUp/styles';
import React, { VFC, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { IUser } from '@typings/db';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: (flag: boolean) => void;
}

const InviteChannelModal: VFC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000,
  });
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

  const { mutate } = useSWR<IUser[]>(
    userData && channel ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const [newMember, onChangeNewMember, setNewMember] = useInput('');

  const onInviteMember = useCallback((e) => {
    e.preventDefault();
    axios
      .post(`/api/workspaces/${workspace}/channels/${channel}`)
      .then((res) => {
        mutate(res.data, false);
        setShowInviteChannelModal(false);
        setNewMember('');
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

export default InviteChannelModal;
