import { Routes, Route, Navigate } from 'react-router-dom'
import { CandidateLayout, RecruiterLayout } from './layouts'

// Candidate screens
import BrowseJobsScreen from './screens/candidate/BrowseJobsScreen'
import JobDetailScreen from './screens/candidate/JobDetailScreen'
import ApplicationFormScreen from './screens/candidate/ApplicationFormScreen'
import ApplicationsScreen from './screens/candidate/ApplicationsScreen'
import ApplicationDetailScreen from './screens/candidate/ApplicationDetailScreen'
import AssessmentLandingScreen from './screens/candidate/AssessmentLandingScreen'
import AssessmentRunScreen from './screens/candidate/AssessmentRunScreen'
import AssessmentCompleteScreen from './screens/candidate/AssessmentCompleteScreen'
import InsightReportScreen from './screens/candidate/InsightReportScreen'
import InterviewLandingScreen from './screens/candidate/InterviewLandingScreen'
import InterviewRunScreen from './screens/candidate/InterviewRunScreen'
import UserInterviewLandingScreen from './screens/candidate/UserInterviewLandingScreen'
import OfferScreen from './screens/candidate/OfferScreen'
import ApplicationClosedScreen from './screens/candidate/ApplicationClosedScreen'
import ConversationsScreen from './screens/candidate/ConversationsScreen'
import ConversationThreadScreen from './screens/candidate/ConversationThreadScreen'
import ProfileScreen from './screens/candidate/ProfileScreen'

// Dev screen
import DSGalleryScreen from './screens/DSGalleryScreen'

// Recruiter screens
import RecruiterVacanciesScreen from './screens/recruiter/RecruiterVacanciesScreen'
import RecruiterCreateVacancyScreen from './screens/recruiter/RecruiterCreateVacancyScreen'
import RecruiterVacancyDetailScreen from './screens/recruiter/RecruiterVacancyDetailScreen'
import RecruiterPipelineScreen from './screens/recruiter/RecruiterPipelineScreen'
import RecruiterApplicationDetailScreen from './screens/recruiter/RecruiterApplicationDetailScreen'
import RecruiterConversationsScreen from './screens/recruiter/RecruiterConversationsScreen'
import RecruiterAIChatDetailScreen from './screens/recruiter/RecruiterAIChatDetailScreen'
import RecruiterProfileScreen from './screens/recruiter/RecruiterProfileScreen'

export default function App() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/jobs" replace />} />

      {/* Candidate routes */}
      <Route element={<CandidateLayout />}>
        <Route path="/jobs" element={<BrowseJobsScreen />} />
        <Route path="/jobs/:id" element={<JobDetailScreen />} />
        <Route path="/jobs/:id/apply" element={<ApplicationFormScreen />} />
        <Route path="/applications" element={<ApplicationsScreen />} />
        <Route path="/applications/job/:id" element={<JobDetailScreen />} />
        <Route path="/applications/:id" element={<ApplicationDetailScreen />} />
        <Route path="/applications/:id/assessment" element={<AssessmentLandingScreen />} />
        <Route path="/applications/:id/assessment/run" element={<AssessmentRunScreen />} />
        <Route path="/applications/:id/assessment/complete" element={<AssessmentCompleteScreen />} />
        <Route path="/applications/:id/insight" element={<InsightReportScreen />} />
        <Route path="/applications/:id/interview" element={<InterviewLandingScreen />} />
        <Route path="/applications/:id/interview/run" element={<InterviewRunScreen />} />
        <Route path="/applications/:id/user-interview" element={<UserInterviewLandingScreen />} />
        <Route path="/applications/:id/offer" element={<OfferScreen />} />
        <Route path="/applications/:id/closed" element={<ApplicationClosedScreen />} />
        <Route path="/conversations" element={<ConversationsScreen />} />
        <Route path="/conversations/:id" element={<ConversationThreadScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>

      {/* Design system gallery (dev only) */}
      <Route path="/_ds" element={<DSGalleryScreen />} />

      {/* Recruiter routes */}
      <Route element={<RecruiterLayout />}>
        <Route path="/r/vacancies" element={<RecruiterVacanciesScreen />} />
        <Route path="/r/vacancies/new" element={<RecruiterCreateVacancyScreen />} />
        <Route path="/r/vacancies/:id" element={<RecruiterVacancyDetailScreen />} />
        <Route path="/r/vacancies/:id/edit" element={<RecruiterCreateVacancyScreen />} />
        <Route path="/r/pipeline" element={<RecruiterPipelineScreen />} />
        <Route path="/r/applications/:id" element={<RecruiterApplicationDetailScreen />} />
        <Route path="/r/conversations" element={<RecruiterConversationsScreen />} />
        <Route path="/r/conversations/:id" element={<RecruiterAIChatDetailScreen />} />
        <Route path="/r/profile" element={<RecruiterProfileScreen />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/jobs" replace />} />
    </Routes>
  )
}
