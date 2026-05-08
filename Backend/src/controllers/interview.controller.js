const pdfParse = require('pdf-parse')
const {generateInterviewReport,generateResumePdf} = require('../services/ai.service')
const interviewReportModel = require('../models/interview.report.model')

async function generateInterviewController(req,res){

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const {selfDescription,jobDescription} = req.body

    const interviewReportByAi = await generateInterviewReport({
        resume:resumeContent.text,
        selfDescription,
        jobDescription
    })


    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume:resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    res.status(201).json({
        message:'Interview report generated successfully',
        interviewReport
    })
}
    

async function getInterviewReportByIdController(req,res){
    const {interviewId} = req.params
    const interviewReport = await interviewReportModel.findOne({_id:interviewId,user:req.user.id})
    
    if(!interviewReport){
        return res.status(404).json({
            message:'Invalid Interview Report Id or Invalid User'
        })
    }
     
     res.status(200).json({
        message:"fetch successful",
        interviewReport
    })
}
    
async function getAllInterviewReportsConroller(req,res){
    const interviewReports = await interviewReportModel.find({user:req.user.id}).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -technicalQuestion-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
    if(!interviewReports){
        res.status(404).json({
            message:'Invalid Interview Report Id'
        })
    }
    res.status(200).json({
        message:"fetch successful",
        interviewReports
    })
}


async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = {generateInterviewController,getInterviewReportByIdController,getAllInterviewReportsConroller,generateResumePdfController}
