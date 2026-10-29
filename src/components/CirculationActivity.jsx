import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CirculationActivity({ data = [] }) {
  return (
    <div className="h-full max-h-[300px] w-full max-w-[500px] rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">
            Circulation Activity
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Borrows vs. Returns | (MM/YYYY) - (MM/YYYY)
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
                <span
                className="h-3 w-3 rounded-sm"
                style={{
                    background: "linear-gradient(to bottom, #1D2937, #53759D)",
                }} />
                <span>Borrows</span>
            </div>

            <div className="flex items-center gap-1.5">
                <span
                className="h-3 w-3 rounded-sm"
                style={{
                    background: "linear-gradient(to bottom, #AA563F, #F6A85E)",
                }} />
                <span>Returns</span>
            </div>
            </div>
        </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 8,
              right: 4,
              left: 0,
              bottom: 0,
            }}
            barCategoryGap="35%"
            barGap={4}>
            <defs>
              <linearGradient
                id="borrowGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1">
                <stop offset="0%" stopColor="#1D2937" />
                <stop offset="100%" stopColor="#53759D" />
              </linearGradient>

              <linearGradient
                id="returnGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1">
                <stop offset="0%" stopColor="#AA563F" />
                <stop offset="100%" stopColor="#F6A85E" />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#737373",
                fontSize: 11,
              }}
              dy={6} />

            <YAxis hide />

            <Tooltip
              cursor={{ fill: "#f8f7f5" }}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #eeeeee",
                fontSize: "11px",
              }} />

            <Bar
              dataKey="borrows"
              name="Borrows"
              fill="url(#borrowGradient)"
              radius={[3, 3, 0, 0]}
              maxBarSize={50} />

            <Bar
              dataKey="returns"
              name="Returns"
              fill="url(#returnGradient)"
              radius={[3, 3, 0, 0]}
              maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CirculationActivity;


