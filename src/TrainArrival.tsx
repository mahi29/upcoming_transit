import d_logo from './img/d_logo.svg'
import f_logo from './img/d_logo.svg'
import n_logo from './img/n_logo.svg'
import r_logo from './img/r_logo.svg'
import default_mta_logo from './img/default_mta_logo.svg'

import './TrainArrival.css';

interface Props {
    subway_line: string
    minutes_to_arrival: number
}
function TrainArrival(props: Props) {
    if (props.minutes_to_arrival <= 0 || props.minutes_to_arrival > 30) {
        return null;
    }

    function getLogo(subway_line: string) {
        switch (subway_line) {
            case "N":
                return n_logo
            case "R":
                return r_logo
            case "F":
                return f_logo
            case "D":
                return d_logo
            default:
                return default_mta_logo
        }
    }
    const logo = getLogo(props.subway_line)
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