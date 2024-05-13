import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './ProjectManagement/Components/Forms/Signup';
import HomePage from './ProjectManagement/Components/HomePage';
import Login from './ProjectManagement/Components/Forms/Login';
import User from './ProjectManagement/Components/User';
import Reviewer from './ProjectManagement/Components/Reiewer';
import Profile from './ProjectManagement/Components/Forms/Profile';
import { AuthProvider } from './ProjectManagement/Context/authContext';
import { Welcome } from './ProjectManagement/Components/Welcome';
import { About } from './ProjectManagement/Components/About';
import { NavBar } from "./ProjectManagement/Components/Navbar";
import AllowReviewer from './ProjectManagement/Components/AllowReviewer';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar/>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/approved-projects" element={<HomePage />} />
          <Route path="/projects" element={<User />} />
          <Route path="/allow-reviewer" element={<AllowReviewer />} />
          <Route path="/reviewer" element={<Reviewer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/*" element={<>Error Page</>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
