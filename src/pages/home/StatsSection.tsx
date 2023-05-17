import  {  useState } from "react";
import {
  BarChart,
  Bar,

  XAxis,

  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
} from "recharts";
import { useQuery } from "react-query";
import pb from "../../helpers/pocketbase";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
/*
const data = [
  {
    name: '8:00',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: '8:30',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: '9:00',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: '9:30',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: '10:00',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: '10:30',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: '11:00',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
*/

export default function StatsSection() {
  async function queryData(referenceDay: Date) {
    let begin = new Date(referenceDay);
    begin.setHours(0, 0, 0, 0);
    let end = new Date(referenceDay);
    end.setHours(23, 59, 59, 999);

    return await pb
      .collection("measurements")
      .getFullList({
        limit: 1000,
        sort: "-time",
        filter: `time>= "${begin.toISOString()}" && time <= "${end.toISOString()}"`,
      })
      .catch((err: any) => {
        console.warn(err);
      })
      .then((res: any) => {
        return res;
      });
  }

  const [day, setDay] = useState<Date>(new Date("2023-05-06T00:01:00.000Z"));
  const [target, setTarget] = useState<Date>(
    new Date("2023-05-06T00:01:00.000Z")
  );




  const workingHours = {
    // 8:00 - 17:00
    start: new Date(new Date().setHours(8, 0, 0, 0)),
    end: new Date(new Date().setHours(17, 0, 0, 0)),
    startIndex: 16,
    endIndex: 33,
  };

  const [processedData, setProcessedData] = useState<any>([]);
  const [dayConsumption, setDayConsumption] = useState<number>(0);
  const [workingHoursConsumption, setWorkingHoursConsumption] =
    useState<number>(0);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["stats"],
    queryFn: () => queryData(target),
    onSuccess: (data) => {
      console.log("Success" + target);
      let processedDataBuf = [];
      for (let i = 0; i < 48; i++) {
        processedDataBuf.push({
          name: `${Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`,
          power: 0,
          powerDataPoints: 0,
          activity: 0,
          activityDataPoints: 0,
        });
      }

      let dayConsumptionBuf = 0;
      let workingHoursConsumptionBuf = 0;

      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        let date = new Date(element.time);
        let hour = date.getHours();
        let minute = date.getMinutes();
        let value = element.value;
        let type = element.type;
        let index = hour * 2 + Math.floor(minute / 30);
        if (type === "power-meter") {
          processedDataBuf[index].power += value || 0;
          processedDataBuf[index].powerDataPoints += 1;
        } else if (type === "activity-meter") {
          processedDataBuf[index].activity += value || 0;
          processedDataBuf[index].activityDataPoints += 1;
        }
      }

      for (let i = 0; i < processedDataBuf.length; i++) {
        processedDataBuf[i].power =
          processedDataBuf[i].power / processedDataBuf[i].powerDataPoints;
        processedDataBuf[i].activity =
          processedDataBuf[i].activity / processedDataBuf[i].activityDataPoints;

        if (isNaN(processedDataBuf[i].power)) {
          processedDataBuf[i].power = 0;
        }
        if (isNaN(processedDataBuf[i].activity)) {
          processedDataBuf[i].activity = 0;
        }

        if (processedDataBuf[i].power > 0) {
          dayConsumptionBuf += processedDataBuf[i].power;

          if (i >= workingHours.startIndex && i <= workingHours.endIndex) {
            workingHoursConsumptionBuf += processedDataBuf[i].power;
          }
        }
      }
      setProcessedData(processedDataBuf);
      setDayConsumption(dayConsumptionBuf);
      setWorkingHoursConsumption(workingHoursConsumptionBuf);
      setDay(target);
    },
  });

  // If data changed, set day to the first day to target

  //console.log(data);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {`${error}`}</span>;
  }

  if (!data) return <span>No data</span>;

  // Refetch every time day changes



  function setActiveDay(d: Date) {
    setTarget(d);
    console.log("setActiveDay to " + d);
    refetch();


  }





  function getConsumtionColor(energy: number) {
    if (energy < 10) {
      return "border-green-500";
    } else if (energy < 40) {
      return "border-yellow-500";
    } else {
      return "border-red-500";
    }
  }

  const prevDay = () => {
    let newDay = new Date(day);
    newDay.setDate(newDay.getDate() - 1);
    return newDay;
  };

  const nextDay = () => {
    let newDay = new Date(day);
    newDay.setDate(newDay.getDate() + 1);
    return newDay;
  };


  

  return (
    <>
      <div className="p-3 lg:p-6 rounded-lg shadow-lg bg-white w-full ">
        {/* <p>{`D: ${data}`}</p> */}
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              
              data={processedData}
              key={`l_${data.length}`}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              {/* Hide Y axis if on mobile */}
                
                {/* <YAxis yAxisId="left" stroke="#8884d8" axisLine={false} />
              
              
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" axisLine={false} /> */}
              <Tooltip />
              <Legend />
              <Bar
                yAxisId={"left"}
                dataKey="power"
                name="Power"
                fill="#8884d8"
                background={true}
              />
              <Bar
                yAxisId={"right"}
                dataKey="activity"
                name="Activity"
                fill="#82ca9d"
                background={true}
              />

              <ReferenceLine y={0} stroke="#000" yAxisId={"left"} />
              <Brush dataKey="name" height={30} stroke="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full h-16 px-6">
          <div className="w-full h-full flex flex-row justify-between">
            <button
              className="flex flex-row items-center justify-center text-sm text-gray-500 hover:text-gray-600"
              onClick={() => {
                setActiveDay(prevDay());
              }}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              <span>Previous day</span>
            </button>

            
            <button
              className="flex flex-row-reverse items-center text-sm text-gray-500 hover:text-gray-600"
              onClick={() => {
                setActiveDay(nextDay());
              }}
            >
              <ArrowRightIcon className="h-4 w-4 ml-2" />
              <span>Next day</span>
            </button>
          </div>
        </div>
      </div>

      {/* <button
            onClick={
                () => {
                    //console.log('clicked');
                    for (let i = 0; i < data.length; i++) {
                        setTimeout(() => {
                                
                            const element = data[i];
                            let date = new Date();
                            date.setHours(Math.floor(i/2));
                            date.setMinutes((i%2)*30);
                            date.setSeconds(0);
                            //console.log(date);
                            pb.collection('measurements').update(element.id, {
                                time: date.toISOString()
                        }).then((res: any) => {
                            //console.log(res);
                        }).catch((err: any) => {
                            console.log(err);
                        })

                            
                        }, 100*i);
                    }

                }
            }   
        >
            Fix time
        </button> */}

      <div className="mt-4 bg-white shadow-lg rounded-lg py-8 px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 px-8 gap-4">
          <div className="flex flex-col justify-stretch items-start ">
            <div
              className={`border-l-4 py-2 pl-4 ${getConsumtionColor(
                dayConsumption
              )}`}
            >
              <p className="text-gray-400 text-sm">Last day</p>
              <p className="text-gray-600 text-2xl font-bold">
                {(dayConsumption / 1000).toFixed(2).toLocaleLowerCase() || 0}{" "}
                kWh
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-stretch items-start ">
            <div className="border-l-4 border-green-500 py-2 pl-4">
              <p className="text-gray-400 text-sm">Working hours</p>
              <p className="text-gray-600 text-lg font-bold">{`${workingHours.start.toLocaleTimeString(
                "et-EE",
                { hour: "2-digit", minute: "2-digit" }
              )} - ${workingHours.end.toLocaleTimeString("et-EE", {
                hour: "2-digit",
                minute: "2-digit",
              })}`}</p>
            </div>
          </div>
          <div className="flex flex-col justify-stretch items-start ">
            <div className="border-l-4 border-green-500 py-2 pl-4">
              <p className="text-gray-400 text-sm">Possible reduction to</p>
              <p className="text-gray-600 text-2xl font-bold">
                {(workingHoursConsumption / 1000).toFixed(2) || 0} kWh
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


