// PieChartComponent.jsx

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const PieChartComponent = ({ male, female }) => {
  const data = [
    { name: "Male", value: male },
    { name: "Female", value: female }
  ];

  return (
    <PieChart width={250} height={250}>
      <Pie data={data} dataKey="value" outerRadius={80} label>
        <Cell fill="#4A90E2" />
        <Cell fill="#FF69B4" />
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default PieChartComponent;