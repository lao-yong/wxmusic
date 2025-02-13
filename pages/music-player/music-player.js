// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from "../../services/player"
import { parseLyric } from "../../utils/parse-lyric"
import playerStore from "../../store/playerStore"
const app = getApp()
 //创建播放器
 const audioContext = wx.createInnerAudioContext()
Page({
  data: {
    currentPage: 0,
    contentHeight: 0,
    id: 0,
    currentSong: {},
    currentTime: 0,
    durationTime: 0, 
    statusHeight: 20,
    contentHeight: 0,
    sliderValue: 0,
    isSliderChanging: false,
    isPlaying: true,
    lyricInfos: [],
    currentLyricText: "",
    currentLiricIndex: -1,
    lyricScrollTop: 0
  },
  onLoad(options) {
    this.setData({
      statusHeight: app.globalData.statusHeight,
      contentHeight: app.globalData.contentHeight
    })

    const id = options.id
    this.setData({id})
    getSongDetail(id).then(res => {
      this.setData({
        currentSong: res.songs[0],
        durationTime: res.songs[0].dt
      })
    })
    //获取歌词
    getSongLyric(id).then(res => {
      const lrcString = res.lrc.lyric
      const lyricInfos = parseLyric(lrcString)
      this.setData({ lyricInfos })  
    })
    //播放当前歌曲
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.autoplay = true

    // 监听播放进度
    audioContext.onTimeUpdate(() => {
     //记录当前时间
     if(!this.data.isSliderChanging) {
        this.setData({currentTime: audioContext.currentTime * 1000})

      //进度条
        const sliderValue = this.data.currentTime / this.data.durationTime * 100
        this.setData({sliderValue})
     }

     //匹配正确的歌词
     if(!this.data.lyricInfos.length) return
          let index = this.data.lyricInfos.length - 1
     for(let i = 0; i < this.data.lyricInfos.length; i++) {
       const info = this.data.lyricInfos[i]
       if(info.time > audioContext.currentTime * 1000) {
         index = i - 1
         break
       }
     }
     if(index === this.data.currentLiricIndex) return

     //获取歌词的索引index和text
     //改变歌词滚动页面的位置
     const currentLyricText = this.data.lyricInfos[index].text
     this.setData({ currentLyricText,
                    currentLiricIndex: index,
                    lyricScrollTop: 24 * index
                    })

     
    
    })

    //  获取共享数据
    //  playerStore.onState(["playSongList", "playSongIndex"], this.getPlaySongInfoHandler)

    // audioContext.onWaiting(() => {
    //   audioContext.pause()
    // })
    // audioContext.onCanplay(() => {
    //   audioContext.play()
    // })

   

   
  },
  // 事件监听
  onSwiperChange(event) {
    this.setData({currentPage: event.detail.current})
  },
  onNavTabItemTab(event) {
    const index = event.currentTarget.dataset.index
    this.setData({currentPage: index})
  },


  onSliderChannge(event) {
    //获取点击滑块位置的值
    const value = event.detail.value
    
    const currentTime = value / 100 * this.data.durationTime

    audioContext.seek(currentTime / 1000)
    this.setData({currentTime, isSliderChanging: false, sliderValue: value})
  },
  onSliderChanging(event) {
    //获取滑动到的位置
    const value = event.detail.value
    //计算对应时间
    const currentTime = value / 100 * this.data.durationTime
    this.setData({currentTime})

    //当前正在滑动
    this.data.isSliderChanging = true
  },

  // 监听播放暂停
  onPlayOrpause() {
    if(this.data.isPlaying) {
      audioContext.pause()
      this.setData({isPlaying: false})
    } else{
      audioContext.play()
      this.setData({isPlaying: true})
    }
  },

  //共享数据
  // getPlaySongInfoHandler(value) {
  //   console.log(value);
  // },
  // onUnload() {
  //   playerStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfoHandler)
  // }


  onNavBackTap() {
    wx.navigateBack()
  }

})