import React from "react";
import DayList from "components/DayList";
import "components/Application.scss";
// import React, { useState, useEffect } from "react";
import Appointment from "components/Appointment/index";
// import axios from 'axios'
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors";
import useApplicationData from 'hooks/useApplicationData'





export default function Application(props) {
  console.log(useApplicationData)
  
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();
  
  

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
