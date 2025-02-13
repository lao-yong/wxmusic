import { hyrequest } from "./index"

export function getTopMV(offset = 0, limit = 20) {
  return hyrequest.get({
    url: "/top/mv",
    data: {
      limit,
      offset
    }
  })
}

export function getMVUrl(id) {
  return hyrequest.get({
    url: "/mv/url",
    data: {
      id
    }
  })
}

export function getMVInfo(mvid) {
  return hyrequest.get({
    url: "/mv/detail",
    data: {
      mvid
    }
  })
}

export function getMVRelated(id) {
  return hyrequest.request({
    url: "/related/allvideo",
    data: {
      id
    }
  })
}