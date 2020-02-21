// import React from "react";
import DayList from "components/DayList";
import "components/Application.scss";
import React, { useState, useEffect } from "react";
import Appointment from "components/Appointment/index";
import axios from 'axios'
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors";





export default function Application(props) {
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });


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
  
  
  

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers")),
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, [])

  

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {
          getAppointmentsForDay(state, state.day).map(appointment => {
            const interview = getInterview(state, appointment.interview);
            const interviewers = getInterviewersForDay(state, state.day)
            return (
              <Appointment key={appointment.id} interview={interview} bookInterview={bookInterview} cancelInterview={cancelInterview} interviewers={interviewers} id={appointment.id} time={appointment.time} />
            );
          })
        }
        {<Appointment key="last" time="5pm" />}
      </section>
    </main>
  );
}
