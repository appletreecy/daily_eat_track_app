import { Link, Route, Routes } from 'react-router-dom';
import AddMeal from './pages/AddMeal';
import Dashboard from './pages/Dashboard';
import './App.css';

const App = () => {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div>
            <h1 className="brand-title">Daily Eating Tracker</h1>
            <p className="brand-subtitle">Track meals, calories, and nutrition each day</p>
          </div>

          <nav>
            <ul className="nav-list">
              <li>
                <Link to="/" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/add-meal" className="nav-link nav-link-primary">
                  Add Meal
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="page-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-meal" element={<AddMeal />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
