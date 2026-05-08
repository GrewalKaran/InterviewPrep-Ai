import { useContext, useEffect} from "react"
import {InterviewContext} from '../interview.context'
import {generateInterviewReport,getInterviewReportById,getAllInterviewReports,generateResumePdf} from '../services/interview.api'
import { useParams } from "react-router"

export const useInterview = (()=>{

    const {interviewId} = useParams()

    const context = useContext(InterviewContext)

     if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports, resumeDownloading, setResumeDownloading} = context

    const generateReport = (async({resume,selfDescription,jobDescription})=>{
        let response=null
        setLoading(true)
        try{
             response = await generateInterviewReport({resume,selfDescription,jobDescription})
            setReport(response.interviewReport)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
        return response.interviewReport
    })

    const getReportById = (async(interviewId)=>{
        let response
        setLoading(true)
        try{
             response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
        return response.interviewReport
    })

    const getReports = (async()=>{
        let response
        setLoading(true)
        try{
             response = await getAllInterviewReports()
            setReports(response.interviewReports)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
        return response.interviewReports
    })

    const getResumePdf = async (interviewReportId) => {
        setResumeDownloading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setResumeDownloading(false)
        }
    }


    useEffect(()=>{
        if(interviewId){
            getReportById(interviewId)
        }
        else{
            getReports()
        }
    },[])

    return {loading,report,reports,resumeDownloading,generateReport,getReportById,getReports,getResumePdf}
})

