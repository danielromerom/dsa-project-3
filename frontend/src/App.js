import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// import MainPage from './components/MainPage/MainScreen'
import InputTeamPage from './components/InputTeamPage/InputTeam'
// import IdealTeamPage from './components/IdealTeamPage/IdealTeam'
// import SuggestionsPage from './components/SuggestionsPage/Suggestions'
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path="/" element={<MainPage />} /> */}
          <Route path="/" element={<InputTeamPage />} />
          {/* <Route path="/input-team" element={<InputTeamPage />} /> */}
          {/* <Route path="/ideal-team" element={<IdealTeamPage />} />
          <Route path="/suggestions" element={<SuggestionsPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
