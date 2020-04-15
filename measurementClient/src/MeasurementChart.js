/*
 * MeasurementChart.js
 *
 * Juha-Pekka Liimatainen 7.3.2020
*/

import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const MeasurementChart = props => {
  const { data, unitName } = props;
  const chartData = [];

  data.forEach(element => {
    chartData.push({
      time: element.time.Day + '.' + element.time.Month + '. ' +
        element.time.Hours + ':' + element.time.Minutes + ':' + element.time.Seconds,
      value: element.value
    });
  });

  return (
    <div>
      <h4>{unitName}</h4>
      <LineChart width={1300} height={500} data={chartData}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="time" />
        <YAxis type="number" domain={[dataMin => (dataMin - 0.05 * dataMin), dataMax => (dataMax + 0.05 * dataMax)]} />
        <Tooltip />
      </LineChart>
    </div>
  );
};

export default MeasurementChart;