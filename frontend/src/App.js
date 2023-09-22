import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';

function App() {

  const token = localStorage.getItem('accessToken');

  if(!token) {
    return <Login />
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
