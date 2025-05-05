import axios from "axios"
import dotenv from 'dotenv'

dotenv.config()

export const getJudge0LanguageId = (language) => {
    const languageMap = {
        "PYHTON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63,
    }
    return languageMap[language]
}

export const submitBatch = async (submissions) => {
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {
        submissions
    })

    return data;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export const pollBatchResults = async(tokens) => {
    while(true){
        const {data} = await axios.get( `${process.env.JUDGE0_API_URL}/submissions/batch`, {
            params: {
                tokens: tokens.join(','),
                base64_encoded: false,
            },
        })

        const results = data.submissions;

        const isAllDone = results.every(
            // r => r.status.id !== 1 && r.status.id !== 2
            r => r.status.id > 2
        )

        if(isAllDone) return results

        await sleep(1000);
    }
}