import express from 'express'
import { isLoggedIn } from '../middleware/auth.middleware.js'
import {getAllSubmissions, getAllSubmissionForProblem, getAllTheSubmissionsForProblem} from '../controllers/submission.controllers.js'
const submissionRoutes = express.Router()

submissionRoutes
    .route('/get-all-submissions')
    .get(isLoggedIn, getAllSubmissions)
submissionRoutes
    .route('/get-submission/:problemId')
    .get(isLoggedIn, getAllSubmissionForProblem)
submissionRoutes
    .route('/get-submissions-count/:problemId')
    .get(isLoggedIn, getAllTheSubmissionsForProblem)
    
export default submissionRoutes