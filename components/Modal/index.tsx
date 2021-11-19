import React, {FC, useCallback} from 'react'

interface Props {
  show: boolean;
  onCloseModal: () => void;
}

const Modal: FC<Props> = ({show, onCloseModal}) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation()
  }, [])

  if(!show) {
    return null;
  }
  
  return ()
}