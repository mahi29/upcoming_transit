import React from 'react';
import './UpcomingBuses.css'
import {
    REFRESH_INTERVAL_MS,
} from "./constants";
import TransitArrival from "./TransitArrival";
type UpcomingBus = { route: string, busNumber: string, arrivalTime: number }
function UpcomingBuses() {

    const [upcomingBuses, setUpcomingBuses] = React.useState<UpcomingBus[]>([])
    const [lastUpdatedAt, setLastUpdatedAt] = React.useState(Date.now())

    function parseBusData(jsonBusData: any): UpcomingBus[] {
        const stopMonitoringDeliveryElement = jsonBusData.Siri.ServiceDelivery.StopMonitoringDelivery[0]
        const parsedUpcomingBuses: UpcomingBus[] = []
        stopMonitoringDeliveryElement.MonitoredStopVisit.forEach((monitoredStopVisit: any) => {
            const vehicleRef = monitoredStopVisit.MonitoredVehicleJourney.VehicleRef
            // vehicleRef is formatted as "MTA NYCT_481"
            const busNumber = vehicleRef.split("_")[1]
            const monitoredCall = monitoredStopVisit.MonitoredVehicleJourney.MonitoredCall
            const arrivalTimeIsoString = monitoredCall.ExpectedArrivalTime ?? monitoredCall.AimedArrivalTime
            const arrivalInSeconds = Math.floor(new Date(arrivalTimeIsoString).getTime()/1000)
            parsedUpcomingBuses.push({"route": "B63", busNumber, arrivalTime: arrivalInSeconds})
        })
        return parsedUpcomingBuses
    }

    React.useEffect(() => {
        async function fetchBusData(): Promise<UpcomingBus[]> {
            try {
                const response = await fetch("/api/busdata")
                if (!response.ok) {
                    console.log(`HTTP error! Status: ${response.status}`)
                    return [];
                }
                const data = await response.json();
                // const hardcodedResponse = `{"Siri":{"ServiceDelivery":{"ResponseTimestamp":"2025-06-08T23:02:39.006-04:00","StopMonitoringDelivery":[{"MonitoredStopVisit":[{"MonitoredVehicleJourney":{"LineRef":"MTA NYCT_B63","DirectionRef":"0","FramedVehicleJourneyRef":{"DataFrameRef":"2025-06-08","DatedVehicleJourneyRef":"MTA NYCT_JG_B5-Sunday-134000_B63_675"},"JourneyPatternRef":"MTA_B630022","PublishedLineName":"B63","OperatorRef":"MTA NYCT","OriginRef":"MTA_306619","DestinationName":"PIER 6 BKLYN BRIDGE PARK via 5 AV","SituationRef":[{"SituationSimpleRef":"MTA NYCT_lmm:alert:438772"}],"Monitored":true,"VehicleLocation":{"Longitude":-73.988368,"Latitude":40.666681},"Bearing":50.243683,"ProgressRate":"normalProgress","Occupancy":"seatsAvailable","BlockRef":"MTA NYCT_JG_B5-Sunday_D_JG_70500_B63-675","VehicleRef":"MTA NYCT_481","MonitoredCall":{"AimedArrivalTime":"2025-06-08T22:56:57.000-04:00","ExpectedArrivalTime":"2025-06-08T23:07:26.065-04:00","AimedDepartureTime":"2025-06-08T22:56:57.000-04:00","ExpectedDepartureTime":"2025-06-08T23:07:26.065-04:00","Extensions":{"Distances":{"PresentableDistance":"0.7 miles away","DistanceFromCall":1076.2,"StopsFromCall":5,"CallDistanceAlongRoute":8577.94},"Capacities":{"EstimatedPassengerCount":9,"EstimatedPassengerCapacity":80,"EstimatedPassengerLoadFactor":"manySeatsAvailable"},"VehicleFeatures":{"StrollerVehicle":false}},"StopPointRef":"MTA_308208","VisitNumber":1,"StopPointName":"5 AV/GARFIELD PL"},"OnwardCalls":{}},"RecordedAtTime":"2025-06-08T23:02:19.000-04:00"},{"MonitoredVehicleJourney":{"LineRef":"MTA NYCT_B63","DirectionRef":"0","FramedVehicleJourneyRef":{"DataFrameRef":"2025-06-08","DatedVehicleJourneyRef":"MTA NYCT_JG_B5-Sunday-137000_B63_676"},"JourneyPatternRef":"MTA_B630022","PublishedLineName":"B63","OperatorRef":"MTA NYCT","OriginRef":"MTA_306619","DestinationName":"PIER 6 BKLYN BRIDGE PARK via 5 AV","OriginAimedDepartureTime":"2025-06-08T22:50:00.000-04:00","SituationRef":[{"SituationSimpleRef":"MTA NYCT_lmm:alert:438772"}],"Monitored":true,"VehicleLocation":{"Longitude":-74.035937,"Latitude":40.612761},"Bearing":236.6737,"ProgressRate":"normalProgress","ProgressStatus":"prevTrip","BlockRef":"MTA NYCT_JG_B5-Sunday_D_JG_72900_B63-676","VehicleRef":"MTA NYCT_380","MonitoredCall":{"AimedArrivalTime":"2025-06-08T23:24:14.000-04:00","ExpectedArrivalTime":"2025-06-08T23:45:33.875-04:00","AimedDepartureTime":"2025-06-08T23:24:14.000-04:00","ExpectedDepartureTime":"2025-06-08T23:45:33.875-04:00","Extensions":{"Distances":{"PresentableDistance":"5.4 miles away","DistanceFromCall":8641.22,"StopsFromCall":40,"CallDistanceAlongRoute":8577.94},"VehicleFeatures":{"StrollerVehicle":false}},"StopPointRef":"MTA_308208","VisitNumber":1,"StopPointName":"5 AV/GARFIELD PL"},"OnwardCalls":{}},"RecordedAtTime":"2025-06-08T23:02:12.000-04:00"},{"MonitoredVehicleJourney":{"LineRef":"MTA NYCT_B63","DirectionRef":"0","FramedVehicleJourneyRef":{"DataFrameRef":"2025-06-08","DatedVehicleJourneyRef":"MTA NYCT_JG_B5-Sunday-140000_B63_677"},"JourneyPatternRef":"MTA_B630022","PublishedLineName":"B63","OperatorRef":"MTA NYCT","OriginRef":"MTA_306619","DestinationName":"PIER 6 BKLYN BRIDGE PARK via 5 AV","OriginAimedDepartureTime":"2025-06-08T23:20:00.000-04:00","SituationRef":[{"SituationSimpleRef":"MTA NYCT_lmm:alert:438772"}],"Monitored":true,"VehicleLocation":{"Longitude":-74.03108,"Latitude":40.616113},"Bearing":248.89516,"ProgressRate":"normalProgress","ProgressStatus":"prevTrip","BlockRef":"MTA NYCT_JG_B5-Sunday_D_JG_74100_B63-677","VehicleRef":"MTA NYCT_388","MonitoredCall":{"AimedArrivalTime":"2025-06-08T23:54:14.000-04:00","ExpectedArrivalTime":"2025-06-08T23:58:11.662-04:00","AimedDepartureTime":"2025-06-08T23:54:14.000-04:00","ExpectedDepartureTime":"2025-06-08T23:58:11.662-04:00","Extensions":{"Distances":{"PresentableDistance":"5.8 miles away","DistanceFromCall":9378.82,"StopsFromCall":40,"CallDistanceAlongRoute":8577.94},"VehicleFeatures":{"StrollerVehicle":false}},"StopPointRef":"MTA_308208","VisitNumber":1,"StopPointName":"5 AV/GARFIELD PL"},"OnwardCalls":{}},"RecordedAtTime":"2025-06-08T23:02:28.000-04:00"}],"ResponseTimestamp":"2025-06-08T23:02:39.006-04:00","ValidUntil":"2025-06-08T23:03:39.006-04:00"}],"SituationExchangeDelivery":[{"Situations":{"PtSituationElement":[{"PublicationWindow":{"StartTime":"2025-06-08T22:29:56.000-04:00"},"Severity":"undefined","Summary":"B35, B63, and B70 buses are running with delays due to the Puerto Rican Day Parade and heavy traffic on 5th Ave between 60th St and 39th Ave.","Description":"B35, B63, and B70 buses are running with delays due to the Puerto Rican Day Parade and heavy traffic on 5th Ave between 60th St and 39th Ave.\\nAllow additional travel time.","Affects":{"VehicleJourneys":{"AffectedVehicleJourney":[{"LineRef":"MTA NYCT_B63"},{"LineRef":"MTA NYCT_B35"},{"LineRef":"MTA NYCT_B70"}]}},"CreationTime":"2025-06-08T18:24:52.000-04:00","SituationNumber":"MTA NYCT_lmm:alert:438772"}]}}]}}}`
                return parseBusData(data)
            } catch (error) {
                console.error("Fetch error:", error);
                throw error;
            }
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
            <div className={"UpcomingBuses-titleRow"}>
                <div className={"UpcomingBuses-title"}> {"B63 NB"} </div>
            </div>
            <div>
                {
                    upcomingBuses.map(function (upcomingBus) {
                        return <div><TransitArrival transitRoute={"Bus"} arrivalTime={upcomingBus.arrivalTime} /></div>
                    })
                }
            </div>
            <div className={"UpcomingBuses-footer"}>{`Last updated at ${new Date(lastUpdatedAt).toLocaleString()}`}</div>
        </div>
    )
}

export default UpcomingBuses