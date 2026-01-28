declare module 'react-gauge-chart' {
  import { ComponentType } from 'react'
  export interface GaugeChartProps {
    id?: string
    nrOfLevels?: number
    arcsLength?: number[]
    colors?: string[]
    arcWidth?: number
    percent?: number
    hideText?: boolean
    needleColor?: string
    needleBaseColor?: string
    animate?: boolean
  }
  const GaugeChart: ComponentType<GaugeChartProps>
  export default GaugeChart
}
