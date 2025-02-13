// pages/detail-menu/detail-menu.js
import { getSongMenuTag, getSongMenuList } from "../../services/music"
Page({
  data: {
    songMenus: []
  },

  onLoad() {
    this.fetchAllMenuList()
  },
  async fetchAllMenuList() {
    //获取tags
    const tagRes = await getSongMenuTag()
    const tags = tagRes.tags

    //根据tags获取歌单
    const allPromises = []
    for(const tag of tags) {
      const promise = getSongMenuList(tag.name)
      allPromises.push(promise)
    }
    //获取到所有数据调用一次setdata
    Promise.all(allPromises).then(res => {
      this.setData({ songMenus: res})
     
    })
  }
 
})