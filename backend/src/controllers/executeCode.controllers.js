import { db } from '../libs/db.js';
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from '../libs/judge0.lib.js';
import { ApiError, ApiSuccess } from '../utils/apiError.js';
const executeCode = async (req, res, next) => {
  const { source_code, language_id, stdin, expected_outputs, problemId } =
    req.body;
  const userId = req.user.id;
  try {
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      !expected_outputs.length === stdin.length
    ) {
      return next(new ApiError(400, 'Invalid or missing testcases'));
    }

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    const results = await pollBatchResults(tokens);

    // console.log(`Results:`);
    // console.log(results);

    let allPassed = true;
    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;

      if (!passed) {
        allPassed = false;
      }

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : null,
      };
      // console.log(`Testcase #${i+1}`);
      // console.log(`Input #${stdin[i]}`);
      // console.log(`Expected output for testcase ${expected_output}`);
      // console.log(`Actual output ${stdout}`);

      // console.log(`Matched: ${passed}`);
    });

    // console.log(detailedResults);

    // storing submissions in db
    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join('\n'),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        status: allPassed ? 'Accepted' : 'Wrong answer', //can also store as enum
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
      },
    });

    // if allPassed = true then mark problem as solved by user

    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: { userId, problemId },
        },
        update: {},
        create: { userId, problemId },
      });
    }

    const testCasesResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await db.testCaseResult.createMany({
      data: testCasesResults,
    });

    const submissionWithTestCase = await db.submission.findUnique({
      where: { id: submission.id },
      include: { testCases: true },
    });

    return res
      .status(200)
      .json(new ApiSuccess(200, 'Code Executed', submissionWithTestCase));
  } catch (error) {
    console.log('Error executing problem: ', error);
    next(new ApiError(500, 'Error executing problem', error));
  }
};

export { executeCode };
