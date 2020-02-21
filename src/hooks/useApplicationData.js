import React, { useState, useEffect } from "react";
import axios from 'axios'


export default function useApplicationData(){
  
  

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers")),
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, [])
  

  function bookInterview(id, interview){
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview}
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };


    return axios({
    method: 'put',
    url: `http://localhost:8001/api/appointments/${id} `,
    data: {
      interview
    }

  }).then(() => setState({...state, appointments: appointments}))
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
        setState({
          ...state,
          appointments
        })
      )
    )
  }


  return { state, setDay, bookInterview, cancelInterview }



}