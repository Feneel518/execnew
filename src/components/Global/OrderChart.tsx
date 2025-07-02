"use client";

import { FC } from "react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from "recharts";

interface OrderChartProps {
  results: {
    name: string;
    numberOfOrders: number;
  }[];
}

const OrderChart: FC<OrderChartProps> = ({ results }) => {
  return (
    <div>
      <ResponsiveContainer width={450} height={180} className=" z-20">
        <BarChart width={150} height={40} data={results}>
          <XAxis dataKey="name" stroke="#e1f3fd" />
          <Tooltip
            formatter={(value) => `${value} orders`}
            cursor={{ fill: "#635e6b50" }}
            contentStyle={{ color: "#040404" }}
            itemStyle={{ color: "#040404" }}
          />
          <Bar
            dataKey="numberOfOrders"
            fill="#e1f3fd"
            activeBar={{ className: "bg-transparent" }}
          ></Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderChart;
