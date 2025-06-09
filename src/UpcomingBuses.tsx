import React from 'react';
import './UpcomingBuses.css'
import {
    REFRESH_INTERVAL_MS,
} from "./constants";
import {getDuration} from "./helpers";
import TransitArrival from "./TransitArrival";
type UpcomingBus = { route: string, arrivalTime: number }
type TrainsAtStation = UpcomingBus[]
function UpcomingBuses() {

    const [upcomingBuses, setUpcomingBuses] = React.useState<TrainsAtStation>([])
    const [lastUpdatedAt, setLastUpdatedAt] = React.useState(Date.now())

    function parseBusData(json_response: string): UpcomingBus[] {
        return []
    }
    React.useEffect(() => {
        async function getUpcomingBuses(): Promise<UpcomingBus[]> {
            try {
                fetch('/api/busdata')
                    .then((res) => res.json())
                    .then((data) => console.log(data));
                return []
            } catch (error) {
                console.log(error);
                return []
            }
        }

        async function fetchBusData() {
            return await getUpcomingBuses();
        }

        fetchBusData().then((busData) => {
            setUpcomingBuses(busData)
            setLastUpdatedAt(Date.now())
        })

        const interval = setInterval(() => {
            fetchBusData().then((trainData) => {
                setUpcomingBuses(trainData)
                setLastUpdatedAt(Date.now())
            })
        }, REFRESH_INTERVAL_MS);

        // this now gets called when the component unmounts
        return () => {
            clearInterval(interval)
        };
    }, []);

    return (
        <div className={"NearbyEbikes-container"}>
            <div className={"NearbyEbikes-titleRow"}>
                <div className={"NearbyEbikes-title"}> {"Upcoming Buses"} </div>
            </div>
            <div>
                {
                    upcomingBuses.map(function (upcomingBus) {
                        const minutesLeft = getDuration(upcomingBus.arrivalTime * 1000)
                        return <div><TransitArrival transit_route={"Bus"} minutes_to_arrival={minutesLeft} /></div>
                    })
                }
            </div>
            <div className={"UpcomingBuses-footer"}>{`Last updated at ${new Date(lastUpdatedAt).toLocaleString()}`}</div>
        </div>
    )
}

export default UpcomingBuses