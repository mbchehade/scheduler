export function getAppointmentsForDay(state, day) {
  let result = [];
  let today = state.days.filter(val => val.name === day);
  
  if (today.length === 0) return result;
  
  let appKeys = Object.keys(state.appointments).map(num => parseInt(num, 10));
  let todayKeys = today[0].appointments;
  let common = todayKeys.filter(value => appKeys.includes(value))
  for (let i = 0; i < common.length; i++) {
    result.push(state.appointments[common[i]])
  }
  return result;
};

export function getInterviewersForDay(state, day) {
  const filteredDays = state.days.filter(eachDay => eachDay.name === day);

  if (filteredDays.length === 0) {
    return [];
  } else {
    const interviewersMapped = filteredDays[0].interviewers.map((interviewer) => {
      return state.interviewers[interviewer]
    })
    console.log(interviewersMapped)
    return interviewersMapped;
  }
};

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  } else {
    const newInterview = {...interview, interviewer: {...state.interviewers[interview.interviewer] }} 
    return newInterview;
  }
}
