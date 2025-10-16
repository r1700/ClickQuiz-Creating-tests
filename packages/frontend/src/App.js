import './App.css';
import CreateExamMain from './component/createExam/CreateExam';
import EditExam from './component/createExam/EditExam';
import ExportExam from './component/createExam/ExportExam';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      {/* <CreateExamMain/>/ */}
      <Router>
      <Routes>
        <Route path="/" element={<CreateExamMain />} />
        <Route path="/export-exam/:id" element={<ExportExam />} />
        <Route path="/edit-exam/:examId" element={<EditExam />} />
      </Routes>
    </Router>

    </>
  );
}

export default App;
