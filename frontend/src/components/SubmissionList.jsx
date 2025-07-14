import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar
} from 'lucide-react';

const SubmissionList = ({ submissions, isLoading }) => {
  
  const safeParse = data => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.log('Error parsing data: ', error);
      return [];
    }
  };

  const calculateAvgMemory = memoryData => {
    const memoryArray = safeParse(memoryData).map(m => parseFloat(m.split(' ')[0]));

    if (memoryArray.length === 0) return 0;
    return memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length;
  };

  const calculateAvgTime = timeData => {
    const timeArray = safeParse(timeData).map(t => parseFloat(t.split(' ')[0]));

    if (timeArray.length === 0) return 0;
    return timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!submissions?.length) {
    return (
      <div className="text-center p-8">
        <div className="text-base-content/70">No submissions yet</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map(submission => {
        const avgMemory = calculateAvgMemory(submission.memory);
        const avgTime = calculateAvgTime(submission.time);

        return (
          <div
            key={submission.id}
            className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow rounded-lg"
          >
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                {/* Left Section: Status and Language */}
                <div className="flex items-center gap-4">
                  {submission.status === 'Accepted' ? (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="font-semibold">Accepted</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-error">
                      <XCircle className="w-6 h-6" />
                      <span className="font-semibold">{submission.status}</span>
                    </div>
                  )}
                  <div className="badge badge-neutral">{submission.language}</div>
                </div>

                {/* Right Section: Runtime, Memory, and Date */}
                <div className="flex items-center gap-4 text-base-content/70">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{avgTime.toFixed(3)} s</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Memory className="w-4 h-4" />
                    <span>{avgMemory.toFixed(0)} KB</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(submission.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionList;
