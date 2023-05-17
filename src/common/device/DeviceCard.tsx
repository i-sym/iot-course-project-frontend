import { CubeIcon } from "@heroicons/react/24/outline";
import { DeviceTwin } from "../../types/DigitalTwin"
import { BoltIcon, SignalIcon } from "@heroicons/react/20/solid";
import pb from "../../helpers/pocketbase";
import { LockClosedIcon } from "@heroicons/react/24/solid";

export default function DeviceCard({device}: {device: DeviceTwin}) {

    function switchRelay(state: boolean) {
        const msg = state ? 'on' : 'off';
        fetch(`/api/state/${device.deviceId}?state=${msg}`, {method: 'POST', mode: 'cors'})
            .then(res => console.log(res))
    }

    return (
        <div className="rounded-lg shadow-lg bg-white flex flex-col justify-start items-center aspect-square">
            <div className="flex w-full justify-between px-6 py-4">
                <h2>{device.deviceId}</h2>
                { pb.authStore.model ? (
                      <></>  
                )
                : (
                        // Tooltip

                        
                        <div className="text-gray-400 relative">
                            <LockClosedIcon className="h-6 w-6"/>  
                        </div>
                )}
            </div>
            <div className="h-32 w-full flex flex-col justify-center items-center grow">
                <CubeIcon className="h-16 text-gray-200"/>
                <h3 className="text-xl font-semibold text-back mt-4">{device.name}</h3>
                <p className="text-gray-400 text-sm mt-2 mb-4">
                    {device.type}
                </p>
            </div>
            <div className="h-12 w-full">
                { device.type === 'relay' && (
                    
                        (pb.authStore.model) ? (
                            <div className="w-full flex flex-row justify-between items-center gap-8 px-8 border-t border-gray-200"> 
                            <button className={` py-2 w-full ${device.value === 1 ? "text-green-500 hover:text-green-600" : "text-gray-400 hover:text-gray-500"}`} onClick={() => switchRelay(true)}>On</button>
                            <button className={` py-2 w-full ${device.value === 0 ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray:500"}`} onClick={() => switchRelay(false)}>Off</button>
                        </div> ): (
                            <div className="w-full flex flex-row justify-between items-center gap-8 px-8 border-t border-gray-200">
                                <button className={`hover:text-gray-600 cursor-not-allowed py-2 w-full  ${device.value === 1 ? "text-green-500" : "text-gray-400"}`}>On</button>
                                <button className={`hover:text-gray-600 cursor-not-allowed py-2 w-full ${device.value === 0 ? "text-red-500" : "text-gray-400"}`}>Off</button>
                            </div>
                        )
                
                )}
                {
                    device.type === 'power-meter' && (
                        <div className="w-full flex flex-row justify-around items-center gap-8 px-8 border-t border-gray-200 h-full">
                                <div className="flex flex-row justify-center items-center">
                                <BoltIcon className="h-5 text-green-500"/>
                                <p className="text-gray-400 text-sm ml-2">{device.value} W</p>
                                </div>
                        </div>
                    )
                }
                {
                    device.type === "activity-meter" && (
                        <div className="w-full flex flex-row justify-around items-center gap-8 px-8 border-t border-gray-200 h-full">
                                <div className="flex flex-row justify-center items-center">
                                <SignalIcon className="h-5 text-green-500"/>
                                <p className="text-gray-400 text-sm ml-2">{device.value} / 10</p>
                                </div>
                        </div>
                    )
                }
            </div>
            
        </div>
    )
}