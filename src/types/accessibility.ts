export const accessibilitiesType = ["transportation","handicap"] as const

export type AccessibilityType = typeof accessibilitiesType[number]

