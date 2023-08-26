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
import TrainArrival from "./TrainArrival";
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

    async function getYellowTrainData(): Promise<UpcomingTrain[]> {
        try {
            const response = await fetch(YELLOW_TRAIN_API_URL, {
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

    async function getOrangeTrainData(): Promise<UpcomingTrain[]> {
        try {
            const response = await fetch(ORANGE_TRAIN_API_URL, {
                headers: {
                    "x-api-key": API_KEY,
                },
            });
            if (!response.ok) {
                console.log("Error fetching orange MTA API");
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

        return mergedArray
    }

    React.useEffect(() => {
        const interval = setInterval(() => {
            (async () => {
                const yellowUpdates = await getYellowTrainData();
                const orangeUpdates = await getOrangeTrainData();
                setUpcomingTrains(mergeTrains(yellowUpdates, orangeUpdates));
                setLastUpdatedAt(Date.now())
            })();
        }, REFRESH_INTERVAL_MS);

        // this now gets called when the component unmounts
        return () => {
            clearInterval(interval)
        };
    });

    return (
        <div>
            {
                upcomingTrains.map(function (upcomingTrain) {
                    const minutesLeft = getDuration(upcomingTrain.arrivalTime * 1000)
                    return <div><TrainArrival subway_line={upcomingTrain.route} minutes_to_arrival={minutesLeft} /></div>
                })
            }
            <div className={"UpcomingTrains-footer"}>{`Last updated at ${new Date(lastUpdatedAt).toLocaleString()}`}</div>
        </div>
    )
}

export default UpcomingTrains