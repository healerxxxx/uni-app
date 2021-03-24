export const  matchListByDay = '/api/mini/matchInfo/getMatchScheduleList/{{categoryId}}' // 赛事列表，?leagueMatchIds=465&jcType=0&day=2019-07-01 00=00=00
export const  matchCountByDay = '/api/front/matchInfo/v4/getDayMatchNumList/{{categoryId}}' // 赛事数量
export const  leagueListyByDay = '/api/front/matchInfo/v4/getDayLeagueMatchList/{{categoryId}}' // 联赛列表
export const  focusMatchList = '/api/front/matchInfo/v4/getUserFocusMatch/{{offset}}/{{limit}}' // 关注的赛事
export const  sfcList = '/api/front/matchInfo/v4/getMatchSFCList' // 胜负彩列表
export const  matchEventList = '/api/front/matchInfo/v4/getMatchInfoList/{{categoryId}}' // 赛事事件增量接口
export const  suprise = '/api/front/matchInfo/v4/getSurpriseMatchList' // 冷门赛事列表
