import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  const Days = props.days.map((day) => {
    return (
      <DayListItem
        id={day.id}
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={day.name === props.day}
        setDay= {(event) => props.setDay(day.name)}
      />
    )
  })
  return (<ul>
    {Days}
  </ul>)
}