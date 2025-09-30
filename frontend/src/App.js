import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import About from './components/About';
import MyTasks from './components/MyTasks';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import { useEffect, useRef } from 'react'; 
import { 
BrowserRouter as Router, 
Routes, 
Route,
useLocation } 
from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const loadingBarRef = useRef(null);

  // ✅ Run once when the app starts
  useEffect(() => {
    if (!sessionStorage.getItem("active")) {
      localStorage.removeItem("user_login");    // Session is new, so clear old login
    }
    sessionStorage.setItem("active", "true");    // Mark session as active
  }, []);  // [] ensures it runs only once

  // Hide Navbar on signup & login pages
  const hideNavbarRoutes = ['/', '/login'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  // ✅ Trigger loading bar on route change
  useEffect(() => {
    if (!shouldHideNavbar) {
      loadingBarRef.current?.continuousStart();
      const timer = setTimeout(() => {
        loadingBarRef.current?.complete();
      }, 500);        // 0.5 sec smooth load
      return () => clearTimeout(timer);
    }
  }, [location]);

return (
    <>
      <LoadingBar 
        color="#BF00FF"
        height={4} 
        ref={loadingBarRef} 
      />

      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/home" element = {<Home />} />
        <Route path="/about" element = {<About />} />
        <Route path="/all" element = {<MyTasks />} />
      </Routes>
    </>
  );
}

export default App;
