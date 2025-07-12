import { VStack } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/home/Home';
import { Login } from './pages/login/Login';
import { Register } from './pages/register/Register';
import { PrivateRoute } from './components/privateRoute/PrivateRoute';

function App() {
  return (
    <VStack
      // border='1px solid black'
      align='stretch'
      h='100vh'
      overflowY={{
        base: 'auto',
        sm: 'auto'
      }}
      bgColor='#f5f5f5'
    >
      <Routes>

        <Route path='/login' element={<Login />}></Route>

        <Route path='/register' element={<Register />}></Route>

        <Route path='/' element={<Home />}>

          <Route path='/user/:component' element={
            <PrivateRoute>
              {/* <UserDashboard /> */}
              <Home />
            </PrivateRoute>
          }></Route>

          <Route path='/admin/:component' element={
            <PrivateRoute>
              {/* <AdminDashboard /> */}
              <Home />
            </PrivateRoute>
          }></Route>
        </Route>

      </Routes>

    </VStack>
  );
}

export default App;
