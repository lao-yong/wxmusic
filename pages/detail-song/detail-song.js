// pages/detail-song/detail-song.js
import recommendStore from "../../store/recommendStore"
import rankingStore from "../../store/rankingStore"
import {getPlaylistDetail} from "../../services/music"
import playerStore from "../../store/playerStore"
Page({
 data: {
  type: "ranking",
  key: "newRanking",
  id: "",
  songInfo: {}
 },

 onLoad(options) {
    const type = options.type
    // this.data.type = type
    this.setData({type})

    if (type === "ranking") {
      const key = options.key
      this.data.key = key
      rankingStore.onState(key, this.handleRanking)
    } else if(type === "recommend") {
      recommendStore.onState("recommendSonInfo", this.handleRanking)
    } else if(type === "menu") {
      const id = options.id
      this.data.id = id
      this.fetchMenuSongInfo()
    } 
 },
 async fetchMenuSongInfo() {
  const res = await getPlaylistDetail(this.data.id)
  this.setData({songInfo: res.playlist})
 },

 //store
 onSongItemTap() {
   playerStore.setState("playsongList", this.data.songInfo.tracks)
 },

 handleRanking(value) {
   if (this.data.type === "recommend") {
     value.name = "推荐歌曲"
   }
  this.setData({songInfo: value})
  wx.setNavigationBarTitle({
    title: value.name,
  })
 },

 onUnload() {
  if(this.data.type === "ranking") {
    rankingStore.offState(this.data.key, this.handleRanking)
  } else if(this.data.type === "recommend") {
    recommendStore.offState("recommendSonInfo", this.handleRanking)
  }
 }
})