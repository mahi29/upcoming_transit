import n_logo from './img/n_logo.svg'
import r_logo from './img/r_logo.svg'
import './TrainArrival.css';

interface Props {
    subway_line: string
    minutes_to_arrival: number
}
function TrainArrival(props: Props) {
    if (props.minutes_to_arrival <= 0 || props.minutes_to_arrival > 30) {
        return null;
    }
    const logo = props.subway_line === "N" ? n_logo : r_logo
    let cssClassForDisplay = "trainArrival-displayString"
    if (props.minutes_to_arrival < 6) {
        cssClassForDisplay += " trainArrival-tooLate"
    } else if (props.minutes_to_arrival < 10) {
        cssClassForDisplay = " trainArrival-warning"
    }
    return (
        <div className={"trainArrival-row"}>
            <img className={"trainArrival-logo"} src={logo} alt="Subway Logo"/>
            <div className={cssClassForDisplay}>{`${props.minutes_to_arrival} min`}</div>
        </div>
    )
}

export default TrainArrival