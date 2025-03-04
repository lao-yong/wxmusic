// pages/detail-video/detail-video.js
import {getTopMV, getMVUrl, getMVInfo, getMVRelated } from "../../services/video"
Page({
  data: {
    id: 0,
    mvUrl: "",
    mvInfo:{},
    relatedVideo: [],
    videoList: [],
    offset: 0,
    hasMore: true,
    danmuList: [
      {text: "哈哈哈，真好听", color:":#ff0000", time: 3},
      {text: "不错哦", color:":#ffff00", time: 6},
      {text: "好喜欢", color:":#ffff00", time: 10},
    ]
  },
  onLoad(options) {
    //获取id
    const id = options.id
    this.setData({ id })

    //2、请求数据
    this.fetchMVUrl()
    this.fetchMVInfo()
    this.fetchMVRelated()
    this.fetchTopMV()
  },
  
  async fetchMVUrl() {
    const res = await getMVUrl(this.data.id)
    this.setData({mvUrl: res.data.url})
  },
  async fetchMVInfo() {
    const res = await getMVInfo(this.data.id)
    this.setData({mvInfo: res.data })
  },
  async fetchMVRelated() {
    const res = await getMVRelated(this.data.id)
    this.setData({relatedVideo: res.data})
  },
  async fetchTopMV() {
    //1、获取数据
    const res = await getTopMV(this.data.offset)

    //2、将新的数据追加原来的数据后面
    const newVideoList = [...this.data.videoList, ...res.data]

    //3、设置新的数据
    this.setData({videoList: newVideoList})
    this.data.offset = this.data.videoList.length
    this.data.hasMore = res.hasMore
   
  },
  
})