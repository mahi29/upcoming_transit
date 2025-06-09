import React from 'react';
import './UpcomingTrains.css'
import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import {
    API_KEY,
    ORANGE_TRAIN_API_URL,
    REFRESH_INTERVAL_MS,
    UNION_ST_STATION_ID,
    YELLOW_TRAIN_API_URL
} from "./constants";
import {getDuration} from "./helpers";
import TransitArrival from "./TransitArrival";
type UpcomingTrain = { route: string, arrivalTime: number }
type TrainsAtStation = UpcomingTrain[]
function UpcomingTrains() {

    const [upcomingTrains, setUpcomingTrains] = React.useState<TrainsAtStation>([])
    const [lastUpdatedAt, setLastUpdatedAt] = React.useState(Date.now())

    function parseData(feed: GtfsRealtimeBindings.transit_realtime.FeedMessage) {
        const matchingTrains: TrainsAtStation = [];
        feed.entity.forEach((entity) => {
            if (!entity.tripUpdate) {
                return;
            }
            if (!entity.tripUpdate.stopTimeUpdate) {
                return;
            }

            const routeId = entity.tripUpdate.trip.routeId
            if (!routeId) {
                return;
            }

            entity.tripUpdate.stopTimeUpdate.forEach((stopTimeUpdate) => {
                if (stopTimeUpdate.stopId === UNION_ST_STATION_ID) {
                    const arrival = stopTimeUpdate.arrival?.time
                    if (!arrival) {
                        return;
                    }
                    // @ts-ignore
                    matchingTrains.push({route: routeId, arrivalTime: arrival})
                }
            })
        });

        return matchingTrains.sort((a, b) => a.arrivalTime - b.arrivalTime)
    }

    function mergeTrains(trainSet1: UpcomingTrain[], trainSet2: UpcomingTrain[]): UpcomingTrain[] {
        let trainSet1Pointer: number = 0
        let trainSet2Pointer: number = 0
        const mergedArray: UpcomingTrain[] = []
        while (trainSet1Pointer < trainSet1.length && trainSet2Pointer < trainSet2.length) {
            const tmp1 = trainSet1[trainSet1Pointer]
            const tmp2 = trainSet2[trainSet2Pointer]
            if (tmp1.arrivalTime < tmp2.arrivalTime) {
                mergedArray.push(tmp1)
                trainSet1Pointer += 1
            } else {
                mergedArray.push(tmp2)
                trainSet2Pointer += 1
            }
        }

        while (trainSet1Pointer < trainSet1.length) {
            mergedArray.push(trainSet1[trainSet1Pointer])
            trainSet1Pointer += 1
        }

        while (trainSet2Pointer < trainSet2.length) {
            mergedArray.push(trainSet2[trainSet2Pointer])
            trainSet2Pointer += 1
        }

        // Return only the first 3 trains
        return mergedArray.slice(0,3)
    }


    React.useEffect(() => {
        async function getTrainData(line_color: "yellow" | "orange"): Promise<UpcomingTrain[]> {
            const api_url = line_color === "yellow" ? YELLOW_TRAIN_API_URL : ORANGE_TRAIN_API_URL
            try {
                const response = await fetch(api_url, {
                    headers: {
                        "x-api-key": API_KEY,
                    },
                });
                if (!response.ok) {
                    console.log("Error fetching MTA API");
                    return []
                }
                const buffer = await response.arrayBuffer();
                const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
                    new Uint8Array(buffer)
                );
                const parsedData = parseData(feed)
                return Array.from(parsedData.values())
            } catch (error) {
                console.log(error);
                return []
            }
        }

        async function fetchTrainData() {
            const yellowUpdates = await getTrainData("yellow");
            const orangeUpdates = await getTrainData("orange");
            return mergeTrains(yellowUpdates, orangeUpdates)
        }

        fetchTrainData().then((trainData) => {
            setUpcomingTrains(trainData)
            setLastUpdatedAt(Date.now())
        })

        const interval = setInterval(() => {
            fetchTrainData().then((trainData) => {
                setUpcomingTrains(trainData)
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
            <div className={"UpcomingTrains-titleRow"}>
                <div className={"UpcomingTrains-title"}> {"Trains to MAN"} </div>
            </div>
            <div>
                {
                    upcomingTrains.map(function (upcomingTrain) {
                        return <div><TransitArrival transitRoute={upcomingTrain.route} arrivalTime={upcomingTrain.arrivalTime} /></div>
                    })
                }
            </div>
            <div className={"UpcomingTrains-footer"}>{`Last updated at ${new Date(lastUpdatedAt).toLocaleString()}`}</div>
        </div>
    )
}

export default UpcomingTrains