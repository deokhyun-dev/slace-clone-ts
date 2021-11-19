import React, { FC, CSSProperties, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from '@components/Menu/styles';

// Props를 받으면 Props들에 대한 타입들을 꼭 적어줘야함

interface Props {
  style: CSSProperties;
  show: boolean;
  onCloseModal: (e: any) => void;
  closeButton?: boolean;
}

const Menu: FC<Props> = ({ children, style, show, onCloseModal, closeButton }) => {
  // 모달 바깥부분은 클릭했을 때 닫히게 하는 방법

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <CreateMenu onClick={onCloseModal}>
      <div onClick={stopPropagation} style={style}>
        {closeButton && <CloseModalButton onClick={onCloseModal}> &times; </CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};

// props 값이 없을 때 대비해서 defaultProps 설정
Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
