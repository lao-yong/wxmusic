import { hyrequest } from "./index"

export function getSongDetail(ids) {
  return hyrequest.get({
    url: "/song/detail",
    data: {
      ids
    }
  })
}

export function getSongLyric(id) {
  return hyrequest.get({
    url: "/lyric",
    data: {
      id
    }
  })
}
