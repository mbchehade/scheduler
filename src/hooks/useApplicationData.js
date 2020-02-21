// import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useEffect, useReducer } from "react";


export default function useApplicationData(){
  
  
const setDay = day => dispatch({ type: SET_DAY, value: day})
const SET_DAY = 'SET_DAY';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
const SET_INTERVIEW = 'SET_INTERVIEW';
const CANCEL_INTERVIEW = 'CANCEL_INTERVIEW'

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  // const setDay = day => setState({ ...state, day });
function reducer(state, action){
  if(action.type === 'add'){
    return state + action.value;
  }
  if(action.type === 'subtract'){
    return state - action.value;
  }

  return state
}

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.value }
      case SET_APPLICATION_DATA:
        return {
          day: state.day,
          days: action.value[0].data,
          appointments: action.value[1].data,
          interviewers: action.value[2].data
        }
      case SET_INTERVIEW: {

        return { ...state, appointments: action.interview }
      }
      case CANCEL_INTERVIEW: {
        return { ...state, appointments: action.interview }
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }


  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers")),
    ]).then((all) => {
      // setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
      dispatch({ type: SET_APPLICATION_DATA, value: all });
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

  }).then(() => dispatch({ type: SET_INTERVIEW, interview: appointments })
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
    )
  }


  return { state, setDay, bookInterview, cancelInterview }



}