import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/SIgnup.jsx';
import Home from './components/HomePage.jsx';  // Assuming you have a Home page component
import './App.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Redirect / to /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Define your home page */}
        <Route path="/home" element={<Home />} />
        
        {/* Login and Signup routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
