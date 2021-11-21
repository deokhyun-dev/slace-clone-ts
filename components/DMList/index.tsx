import useSocket from '@hooks/useSocket';
import { IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useCallback, useState, FC, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import useSWR from 'swr';
import { CollapseButton } from './styles';

const DMList: FC = () => {
  const { workspace } = useParams<{ workspace: string }>();
  console.log(workspace, '워크스페이스');
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000,
  });

  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );

  console.log(workspace);
  const [socket, disconnect] = useSocket(workspace);

  const [channelCollapse, setChannelCollaps] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollaps((prev) => !prev);
  }, []);

  useEffect(() => {
    console.log('DMLIST 바뀜', workspace);
    setOnlineList([]);
  }, [workspace]);

  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      console.log(data, 'DMlist');
      setOnlineList(data);
    });
    // socket?.on('dm', onMessage);
    // console.log('socket on dm', socket?.hasListeners('dm'), socket);
    return () => {
      // socket?.off('dm', onMessage);
      // console.log('socket off dm', socket?.hasListeners('dm'));
      socket?.off('onlineList');
    };
  }, [socket]);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Message</span>
      </h2>
      {!channelCollapse &&
        memberData?.map((member) => {
          const isOnline = onlineList.includes(member.id);
          // const count = countList[member.id] || 0;
          return (
            <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
              <i
                className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                  isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                }`}
                aria-hidden="true"
                data-qa="presence_indicator"
                data-qa-presence-self="false"
                data-qa-presence-active="false"
                data-qa-presence-dnd="false"
              />
              <span>{member.nickname}</span>
              {member.id === userData?.id && <span>(나)</span>}
              {/* {count > 0 && <span className="count">{count}</span>} */}
            </NavLink>
          );
        })}
    </>
  );
};

export default DMList;
