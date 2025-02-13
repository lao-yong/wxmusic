// pages/main-music/main-music.js
import { getMusicBanner, getPlaylistDetail, getSongMenuList } from "../../services/music"
import rankingStore from "../../store/rankingStore"
import recommendStore from "../../store/recommendStore"
import { querySelect } from "../../utils/query_component"
import playerStore from "../../store/playerStore"
const app = getApp()
Page({
  data: {
    searchValue: "",
    banners: [],
    bannerHeight: 0,
    recommendSons: [],
    screenWidth:375,

    //歌单数据
    hotmenuList: [],
    recMenuList: [],
    //巅峰榜数据
    rankingInfos: {

    }
  },

  onLoad() {
   this.fetchMusicBanner()
   this.fetchRecomemdSongs()
   this.fetchSongMenuList()
  
   //发起Action
  
   recommendStore.onState("recommendSonInfo", this.handleRecommendSons)
   recommendStore.dispatch("fetchRecomemdSongsAction")
   rankingStore.onState("newRanking", this.handleNewRanking)
   rankingStore.onState("originRanking", this.handleOriginRanking)
   rankingStore.onState("upRanking", this.handleUpRankings)
   rankingStore.dispatch("fetchRankingDataAction")

   //获取屏幕的尺寸
   this.setData({screenWidth: app.globalData.screenWidth})
  },

  

  //网络请求方法封装
  async fetchMusicBanner() {
     const res = await getMusicBanner()
     this.setData({banners: res.banners})
  },

  async fetchRecomemdSongs() {
      const res = await getPlaylistDetail(3778678)
      const playlist = res.playlist
      const recommendSons = playlist.tracks.slice(0, 6)
      this.setData({ recommendSons })
  },

  async fetchSongMenuList() {
    getSongMenuList().then(res => {
      this.setData({hotmenuList: res.playlists})
    })
    getSongMenuList("华语").then(res => {
      this.setData({recMenuList: res.playlists})
    })
  },

  //监听界面事件监听函数
  onSearchClick() {
    wx.navigateTo({url: "/pages/detail-search/detail-search"})
  },
  onBannerImageLoad(event) {
    querySelect(".banner-image").then(res => {
      this.setData({bannerHeight: res[0].height})
    })
    //获取Image的高度
    // const query =  wx.createSelectorQuery()
    // query.select(".banner-image").boundingClientRect()
    // query.exec((res) => {
    //   this.setData({bannerHeight: res[0].height})
      
    // })
  },
  onRecommendMoreClick() {
    wx.navigateTo({
      url: '/pages/detail-song/detail-song?type=recommend',
    })
  },

  onSongItemTap(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playSongList", this.data.recommendSons)
    playerStore.setState("playSongIndex", index)
  },
  //从store中获取数据
  handleRecommendSons(value) {
    if(!value.tracks) return
    this.setData({recommendSons: value.tracks.slice(0, 6)})
  },

  handleNewRanking(value) {
    const newRankingsInfos = {...this.data.rankingInfos, newRanking: value}
    this.setData({rankingInfos:newRankingsInfos })
  },

  handleOriginRanking(value) {
    const newRankingsInfos = {...this.data.rankingInfos,originRanking: value}
    this.setData({rankingInfos:newRankingsInfos })
  },

  handleUpRankings(value) {
    const newRankingsInfos = {...this.data.rankingInfos,upRanking: value}
    this.setData({rankingInfos: newRankingsInfos })
  },


  onUnload() {
    recommendStore.offState("recommendSongs", this.handleRecommendSons)
    rankingStore.offState("newRanking", this.handleNewRanking)
    rankingStore.offState("originRanking", this.handleOriginRanking)
    rankingStore.offState("upRanking", this.handleUpRankings)
  }
})