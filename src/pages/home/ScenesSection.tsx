import { useQuery } from "react-query";
import pb from "../../helpers/pocketbase";


export default function ScenesSection() {

    async function queryData() {
        return await pb.collection('scenes').getFullList({
            sort: '-created',
            expand: 'device',
        })
    }

    const { isLoading, isError, data, error }  = useQuery({
        queryKey: ['scenes'],
        queryFn: () => queryData(),
    });

    if(isLoading) return (<div>Loading...</div>);

    if(isError) return (<div>Error: {`${error}`}</div>);

    if(!data || data == undefined) return (<div>No data</div>);

    console.log(data);
    
    return (
        <div className="w-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {/* <div className="rounded-lg shadow-lg hover:shadow-sm transition-all bg-white flex flex-col justify-start items-center">
          <div className="flex flex-col w-full justify-between px-6 py-4">
            <h2>Scene 1</h2>
            <div className="mt-2 mb-2 pt-2">
              <div className="flex flex-row justify-start items-center border-2 border-green-500 rounded-lg overflow-hidden">
                <div className="bg-green-500 px-1 py-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-black text-sm">
                    Time: <span className="font-bold">17:15</span>
                  </p>
                </div>
              </div>

              <div className="mt-2 ml-8 flex flex-row justify-start items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-200 px-1 py-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                    />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-black text-sm">
                    3D printer:{" "}
                    <span className="font-bold">Relay off</span>
                  </p>
                </div>
              </div>
              <div className="mt-2 ml-8 flex flex-row justify-start items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-200 px-1 py-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                    />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-black text-sm">
                    ABB robot:{" "}
                    <span className="font-bold">Relay off</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {
          data.map((scene) => {
            return sceneCard(scene);
          })
        }
        {/* <div className="rounded-lg flex flex-col justify-center items-center border-2 border-gray-300 hover:border-slate-300 text-gray-300 hover:text-slate-300 transition-all">
          <PlusIcon className="w-12 h-12 mt-6" />
        </div> */}
      </div>
    )
}

function sceneCard(scene: any){

  const rawTime = new Date(scene.timeTrigger).toLocaleTimeString();

  return (
    <div className="rounded-lg shadow-lg hover:shadow-sm transition-all bg-white flex flex-col justify-start items-center">

    <div className="flex flex-col w-full justify-between px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-700">{scene.name}</h2>
            <div className="mt-4 mb-2 pt-2">
              <div className="flex flex-row justify-start items-center border-2 border-green-500 rounded-lg overflow-hidden">
                <div className="bg-green-500 px-1 py-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-black text-sm">
                    Time: <span className="font-bold">{rawTime}</span>
                  </p>
                </div>
              </div>


              <div className="mt-2 ml-8 flex flex-row justify-start items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-200 px-1 py-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                    />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-black text-sm">
                    {`${scene.expand.device.deviceID} - ${scene.expand.device.type}: `}
                    <span className="font-bold">{scene.newState ? "on" : "off"}</span>
                  </p>
                </div>
              </div>
                
              
            </div>
          </div>
          </div>
  )
}