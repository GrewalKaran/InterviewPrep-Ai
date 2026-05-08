import { createContext ,useState} from "react";

export const InterviewContext = createContext()

export const InterviewProvider = (({children})=>{
    const [resumeDownloading,setResumeDownloading] = useState(false)
    const [loading,setLoading] = useState(false)
    const [report,setReport] = useState(null)
    const [reports,setReports] = useState([])

    return(
        <InterviewContext.Provider value={{loading,setLoading,report,setReport,reports,setReports,resumeDownloading,setResumeDownloading}}>
            {children}
        </InterviewContext.Provider>
    )
})