import styles from './main.module.css';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const FirstPage = () => {
  const navigate = useNavigate();
  const { loading } = useAppSelector(state => state.auth);
  const dispatch = useDispatch<any>();

  const onHandleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <div className={styles.firstPage}>
      <p>First Page</p>
      { loading ?
        (
          <button disabled>Wait a moment...</button>
        ) :
        (
          <button onClick={onHandleLogout}>Logout</button>
        )
      }
    </div>
  );
};