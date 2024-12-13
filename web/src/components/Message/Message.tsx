import { useEffect, useState } from 'react';
import styles from './main.module.css';
type ITypeMessage = 'error' | 'success';

interface IProps {
  datas: {
    typeMessage: ITypeMessage;
    message: string;
  };
};

export const Message = ({ datas }: IProps) => {
  const [isShowMessage, setIsShowMessage] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setIsShowMessage(false);
    }, 3000);
  }, []);
  const { message, typeMessage } = datas;
  
  return (
    <div className={`${styles.divMessage} ${typeMessage === 'error' ? styles.error : styles.success}`}>
      {isShowMessage && (
        <p>{message}</p>
      )}
    </div>
  );
};

