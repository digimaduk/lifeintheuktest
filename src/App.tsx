import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './auth/RequireAuth'
import TopNav from './components/TopNav'
import AboutPage from './pages/AboutPage'
import ChapterWiseQuestionsPage from './pages/ChapterWiseQuestionsPage'
import HomePage from './pages/HomePage'
import ImportantFactsPage from './pages/ImportantFactsPage'
import LoginPage from './pages/LoginPage'
import PracticeTestsPage from './pages/PracticeTestsPage'
import PracticeTestDetailPage from './pages/PracticeTestDetailPage'
import ProgressTrackerPage from './pages/ProgressTrackerPage'
import SignupPage from './pages/SignupPage'
import StudyGuidePage from './pages/StudyGuidePage'
import TopicPage from './pages/TopicPage'

function App() {
  return (
    <>
      <TopNav />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route path="/" element={<HomePage />} />
        <Route
          path="/chapter-wise-questions"
          element={
            <RequireAuth>
              <ChapterWiseQuestionsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/practice-tests"
          element={
            <RequireAuth>
              <PracticeTestsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/progress-tracker"
          element={
            <RequireAuth>
              <ProgressTrackerPage />
            </RequireAuth>
          }
        />
        <Route
          path="/important-facts"
          element={
            <RequireAuth>
              <ImportantFactsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/important-facts/:category"
          element={
            <RequireAuth>
              <ImportantFactsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/topics/:topicId"
          element={
            <RequireAuth>
              <TopicPage />
            </RequireAuth>
          }
        />
        <Route
          path="/practice-tests/:testId"
          element={
            <RequireAuth>
              <PracticeTestDetailPage />
            </RequireAuth>
          }
        />
        <Route
          path="/study-guide"
          element={
            <RequireAuth>
              <StudyGuidePage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
