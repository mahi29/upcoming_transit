export function maybeGetFormattedDurationString(seconds: number): string {
    const milliseconds = new Date(seconds * 1000).getTime() - Date.now()
    const secondDifference =  Math.floor(milliseconds / 1000)
    const minutes = Math.floor(secondDifference / 60);
    if (minutes <= 0) {
        return ""
    }

    if (minutes > 30) {
        return ""
    }
    return `${minutes} min`
}