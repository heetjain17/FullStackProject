import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

const executeCode = async (req,res) => {
    const {source_code, language_id, stdin, expected_ouputs, problemId} = req.body;
    const UserId = req.user.id;

    try {
        if(
            !Array.isArray(stdin) || stdin.length === 0 || 
            !Array.isArray(expected_ouputs) || expected_ouputs.length !== stdin.length
        ){
            return res.status(400).json({error: "Invalid or Missing test cases"})
        }

        const submissions = stdin.map(input => ({
            source_code,
            language_id,
            stdin: input,
        }))

        const submitResponse = await submitBatch(submissions)

        const tokens = submitResponse.map(res => res.token)

        const results = await pollBatchResults(tokens)

        res.status(200).json({
            message: "Exectued successfully"
        })
    } catch (error) {
        
    }
}


export {
    executeCode,

}