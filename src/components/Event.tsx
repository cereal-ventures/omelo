import React from "react";
import { formatDate } from "../utils";

interface EventProps{
  y: number;
  date: Date;
  title: string;
  isOverdue: boolean;
  handleClick: () => void;
};

export default function Event({
  y = 20,
  date,
  title,
  isOverdue,
  handleClick = () => alert("this worked")
}: EventProps) {
  const fillColor = isOverdue ? "#F14965" : "#D3D5E0";
  const textColor = isOverdue ? "#F14965" : "black";
  return (
    <g className="event-wrapper" onClick={handleClick}>
      <text
        textAnchor="end"
        x="-8"
        y={y + 2}
        alignmentBaseline="middle"
        className="event-date"
        fill={textColor}
      >
        {formatDate(date)}
      </text>
      <circle fill={fillColor} r={7} cx={10} cy={y} />
      <text
        x="28"
        y={y + 2}
        className="event-label"
        alignmentBaseline="middle"
        fill={textColor}
      >
        {title}
      </text>
    </g>
  );
}
