import React from 'react';
import './styles.scss';
import Header from 'components/Appointment/Header';
import Empty from 'components/Appointment/Empty';
import Show from 'components/Appointment/Show';
import useVisualMode from 'hooks/useVisualMode';
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status"
import Confirm from "components/Appointment/Confirm"
import Error from "components/Appointment/Error"


const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVE = 'SAVE';
const CONFIRM = 'CONFIRM';
const DELETING = 'DELETING';



export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer){
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVE)
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))

  }

  function deleting(){
    transition(DELETING)
    props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
  }
  


  return (
    <article className='appointment'>
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === DELETING && (
        <Status 
        message='Deleting'
        />
      )}
      {mode === CONFIRM && (
        <Confirm
        message='Are you sure you would like to delete?'
        onCancel={() => back()}
        onConfirm={deleting}
        />
      )}
      {mode === SAVE && <Status message='saving' />}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back(EMPTY)}
          onSave={(name, interviewer) => { save(name, interviewer)}}
        />
      )}
    </article>
  );
};