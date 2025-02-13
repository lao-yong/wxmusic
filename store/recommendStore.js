import { HYEventStore } from "hy-event-store"
import { getPlaylistDetail } from "../services/music"

const recommendStore = new HYEventStore({
  state: {
    recommendSonInfo: []
  },
  actions: {
    fetchRecomemdSongsAction(ctx) {
      getPlaylistDetail(3778678).then(res => {
        ctx.recommendSonInfo = res.playlist
      })
    }
  }
})

export default recommendStore