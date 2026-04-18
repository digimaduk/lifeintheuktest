import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './auth/RequireAuth'
import TopNav from './components/TopNav'
import WithSupportSidebar from './components/WithSupportSidebar'
import AboutPage from './pages/AboutPage'
import ChapterWiseQuestionsPage from './pages/ChapterWiseQuestionsPage'
import ContactPage from './pages/ContactPage'
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
        <Route
          path="/login"
          element={
            <WithSupportSidebar>
              <LoginPage />
            </WithSupportSidebar>
          }
        />
        <Route
          path="/signup"
          element={
            <WithSupportSidebar>
              <SignupPage />
            </WithSupportSidebar>
          }
        />
        <Route
          path="/about"
          element={
            <WithSupportSidebar>
              <AboutPage />
            </WithSupportSidebar>
          }
        />
        <Route
          path="/contact"
          element={
            <WithSupportSidebar>
              <ContactPage />
            </WithSupportSidebar>
          }
        />

        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/chapter-wise-questions"
          element={
            <RequireAuth>
              <WithSupportSidebar>
                <ChapterWiseQuestionsPage />
              </WithSupportSidebar>
            </RequireAuth>
          }
        />
        <Route
          path="/practice-tests"
          element={
            <RequireAuth>
              <WithSupportSidebar>
                <PracticeTestsPage />
              </WithSupportSidebar>
            </RequireAuth>
          }
        />
        <Route
          path="/progress-tracker"
          element={
            <RequireAuth>
              <WithSupportSidebar>
                <ProgressTrackerPage />
              </WithSupportSidebar>
            </RequireAuth>
          }
        />
        <Route
          path="/important-facts"
          element={
            <RequireAuth>
              <WithSupportSidebar>
                <ImportantFactsPage />
              </WithSupportSidebar>
            </RequireAuth>
          }
        />
        <Route
          path="/important-facts/:category"
          element={
            <RequireAuth>
              <WithSupportSidebar>
                <ImportantFactsPage />
              </WithSupportSidebar>
            </RequireAuth>
          }
        />
        <Route
          path="/topics/:topicId"
          element={
            <RequireAuth>
              <WithSupportSidebar>
                <TopicPage />
              </WithSupportSidebar>
            </RequireAuth>
          }
        />
        <Route
          path="/practice-tests/:testId"
          element={
            <RequireAuth>
              <WithSupportSidebar>
                <PracticeTestDetailPage />
              </WithSupportSidebar>
            </RequireAuth>
          }
        />
        <Route
          path="/study-guide"
          element={
            <RequireAuth>
              <WithSupportSidebar>
                <StudyGuidePage />
              </WithSupportSidebar>
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
