import React, { forwardRef, useImperativeHandle, RefObject } from 'react';

type ModalProps = {
  onOk: () => void;
  message: string;
  title: string;
};

export type ModalHandle = {
  close: () => void;
};

const Modal = forwardRef<ModalHandle, ModalProps>((props, forwardedRef) => {
  const { onOk, message, title } = props;

  const close = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const dialogRef = React.useRef<HTMLDialogElement>(null);

  useImperativeHandle(forwardedRef, () => ({
    close,
  }));

  return (
    <dialog ref={dialogRef} className="bg-white shadow-lg p-4 rounded-lg">
      <h3 className='text-xl font-semibold'>{title}</h3>
      <p>{message}</p>
      <button onClick={close}>Cancel</button>
      <button onClick={onOk}>OK</button>
    </dialog>
  );
});

export default Modal;