import './App.css';
import CreateExamMain from './component/CreateExam';
import ExportExam from './component/ExportExam';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      {/* <CreateExamMain/>/ */}
      <Router>
      <Routes>
        <Route path="/" element={<CreateExamMain />} />
        <Route path="/export-exam/:id" element={<ExportExam />} />
      </Routes>
    </Router>

    </>
  );
}

export default App;
