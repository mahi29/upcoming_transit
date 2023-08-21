export function getDuration(toTimeMs: number, fromTimeMs?: number): number {
    const startingTimeMs = fromTimeMs ?? Date.now()
    const milliseconds = new Date(toTimeMs).getTime() - startingTimeMs
    const secondDifference =  Math.floor(milliseconds / 1000)
    return Math.floor(secondDifference / 60);
}