import React from 'react';
import 'components/DayListItem.scss';
import classnames from 'classnames';

export default function DayListItem(props) {

  function formatSpots(props) {
    return props.spots === 0 ? "no spots remaining"
      : (props.spots === 1 ? "1 spot remaining"
        : `${props.spots} spots remaining`)
  }

  
  const dayClass = classnames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots === 0
  });


  return (
    <li className={dayClass} onClick={props.setDay}>
      <h2>{props.name}</h2>
      <h3>{formatSpots(props)}</h3>
    </li>
  );
}