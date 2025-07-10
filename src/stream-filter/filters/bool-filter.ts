// import { ClickData } from '@/click/click-data'
// import {
//   BoolFilterObject,
//   StreamFilter,
//   TextFilterObject,
// } from '@/stream-filter/types'

// export class BoolFilter implements StreamFilter {
//   constructor(
//     private readonly filterObj: BoolFilterObject,
//     private readonly clickData: ClickData,
//     private readonly key: keyof ClickData,
//   ) {}
//
//   handle(): boolean {
//     if (values.length === 0) {
//       return false
//     }
//
//     return values.includes(this.clickData[this.key]?.toString() || '')
//   }
// }
