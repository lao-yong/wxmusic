// pages/main-video/main-video.js
import { getTopMV } from "../../services/video"
Page({
  data: {
    videoList: [],
    offset: 0,
    hasMore: true
  },
  onLoad() {
    //发送网络请求
  //  getTopMV().then(res => {
  //     this.setData({videoList: res.data})
  //   })
  this.fetchTopMV()
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
  //监听上拉和下拉功能
  onReachBottom() {
    //判断是否有更多的数据
    if(!this.data.hasMore) return
    //如果有，加载
    this.fetchTopMV()
  },
  //下拉刷新
  async onPullDownRefresh() {
    //清空之前的数据
    this.setData({videoList: []})
    this.data.offset = 0
    this.data.hasMore = true

    //重新请求新数据
    await this.fetchTopMV()
     
      //4、停止下拉刷新
      wx.stopPullDownRefresh()
  
  },
  //事件监听方法
  onVideoItemTap(event) {
    // const item = event.currentTarget.dataset.item
    // wx.navigateTo({
    //   url: `/pages/detail-video/detail-video?id=${item.id}`,
    // })
  }
})