import { useQuery } from "react-query";
import DeviceCard from "../../common/device/DeviceCard";
import { DeviceTwin } from "../../types/DigitalTwin";
import pb from "../../helpers/pocketbase";


export default function DevicesSection() {

    async function queryData() {
        return await pb.collection('devices').getFullList({
            sort: '-created',
        })
    }

    const { isLoading, isError, data, error }  = useQuery({
        queryKey: ['devices'],
        queryFn: () => queryData(),
        refetchInterval: 1000,
    });

    if(isLoading) return (<div>Loading...</div>);

    if(isError) return (<div>Error: {`${error}`}</div>);




    let devices: DeviceTwin[] = [];

    // data.forEach((device: any) => {
    //     device.types.forEach((type: any) => {
    //         devices.push(new DeviceTwin(device.id, type, device.name));
    //     });
    // });

    if(data){
    data.forEach((device: any) => {
        
            let deviceType: 'relay' | 'power-meter' | 'activity-meter' | 'unknown'= 'unknown';

            switch(device.type) {
                case 'relay':
                    deviceType = 'relay';
                    break;
                case 'power-meter':
                    deviceType = 'power-meter';
                    break;
                case 'activity-meter':
                    deviceType = 'activity-meter';
                    break;
                default:
                    deviceType = 'unknown';
            }

            
            if((pb.authStore.model? device.owner.includes(pb.authStore.model.id) : false) || device.public){
                let update = new Date(device.updated);
                let now = new Date();



                let online = (now.getTime() - update.getTime()) < 10000;
                devices.push(new DeviceTwin(device.deviceID, deviceType, device.name, online, device.lastValue));
            }
        }
    );
       
    }


    return (

            <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {devices.map((device) => (
                    <DeviceCard device={device}/>
                ))}
            </div>
    )
}