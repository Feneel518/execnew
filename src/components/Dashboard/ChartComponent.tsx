"use client";
import { FC } from "react";
import { BarChart, Bar, ResponsiveContainer, Tooltip } from "recharts";

interface ChartComponentProps {}
const data = [
  {
    name: "Page A",
    uv: 2000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
const ChartComponent: FC<ChartComponentProps> = ({}) => {
  return (
    <div>
      <ResponsiveContainer width={384} height={180} className=" z-20">
        <BarChart width={150} height={40} data={data}>
          <Tooltip
            cursor={{ fill: "#635e6b50" }}
            contentStyle={{ color: "#040404" }}
            itemStyle={{ color: "#040404" }}
          />
          <Bar
            dataKey="uv"
            fill="#e1f3fd"
            activeBar={{ className: "bg-transparent" }}
          ></Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
