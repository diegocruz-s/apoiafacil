import { Auth } from './pages/Auth/Auth'
import { FirstPage } from './pages/FirstPage/FirstPage';
import { useAuth } from './utils/checkAuth';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const { auth, loading: loadingCheckAuth } = useAuth();

  if(loadingCheckAuth) {
    return <p style={{ color: '#fff' }}>Carregando...</p>
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ auth ? <FirstPage /> : <Navigate to='/auth' />} />
          <Route path='/auth' element={ auth ? <Navigate to='/' /> : <Auth />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
