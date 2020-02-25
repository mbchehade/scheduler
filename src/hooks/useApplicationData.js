import { useEffect, useReducer } from "react";
import axios from 'axios';



import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  UPDATE_SPOTS,
  CANCEL_INTERVIEW,
} from "reducers/application";


export default function useApplicationData() {

  // const setDay = day => setState(prev => ({ ...prev, day }));
  const setDay = day => dispatch({ type: SET_DAY, value: day })


  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    const promise1 = axios.get("/api/days");
    const promise2 = axios.get("/api/appointments");
    const promise3 = axios.get("/api/interviewers");
    Promise.all([promise1, promise2, promise3])
      .then((all) => {
        // setState(prev => ({ day: state.day, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
        dispatch({ type: SET_APPLICATION_DATA, value: all }); //days, appointments, interviewers });

      });
  }, []);


  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return Promise.resolve(axios.put(`/api/appointments/${id}`, appointment)
      .then(() =>
        dispatch({ type: SET_INTERVIEW, interview: appointments })
      )
      .then(() =>
        dispatch({ type: UPDATE_SPOTS })
      )
    )
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return Promise.resolve(axios.delete(`/api/appointments/${id}`)
      .then(() =>
        dispatch({ type: CANCEL_INTERVIEW, interview: appointments })
      )
      .then(() =>
        dispatch({ type: UPDATE_SPOTS })
      )
    )
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }

}