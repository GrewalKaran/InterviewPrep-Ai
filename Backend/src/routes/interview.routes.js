const express = require('express')
const interviewRouter = express.Router()
const interviewController = require('../controllers/interview.controller')
const upload = require('../middlewares/file.middleware')
const authMiddleware = require('../middlewares/auth.middleware')


/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post("/",authMiddleware,upload.single('resume'),interviewController.generateInterviewController)


interviewRouter.get("/report/:interviewId",authMiddleware,interviewController.getInterviewReportByIdController)


interviewRouter.get("/",authMiddleware,interviewController.getAllInterviewReportsConroller)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware, interviewController.generateResumePdfController)



module.exports = interviewRouter