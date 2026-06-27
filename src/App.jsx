import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { DataProvider } from './context/DataContext.jsx';
import Navbar from './components/Navbar.jsx';
import ReminderWatcher from './components/ReminderWatcher.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddBloodSugar from './pages/AddBloodSugar.jsx';
import AddInsulin from './pages/AddInsulin.jsx';
import EditBloodSugar from './pages/EditBloodSugar.jsx';
import EditInsulin from './pages/EditInsulin.jsx';
import History from './pages/History.jsx';
import Charts from './pages/Charts.jsx';
import Reminders from './pages/Reminders.jsx';
import Report from './pages/Report.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function AppShell() {
  return (
    <DataProvider>
      <ReminderWatcher />
      <div className="app-shell">
        <Navbar />
        <main className="main-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-blood-sugar" element={<AddBloodSugar />} />
            <Route path="/add-insulin" element={<AddInsulin />} />
            <Route path="/edit-blood-sugar/:id" element={<EditBloodSugar />} />
            <Route path="/edit-insulin/:id" element={<EditInsulin />} />
            <Route path="/history" element={<History />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/report" element={<Report />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </DataProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
