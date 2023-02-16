import host from './config'

export default (url,data={},method='GET')=>{
    return new Promise((resolve,reject)=>{
    wx.request({
      url:host.host+url,
      data,
      method,
      header:{
          cookie:'MUSIC_R_T=1638207876960; MUSIC_A_T=1638207876845; WM_TID=Q%2FqI8A5OnTtFFAQBBEJorgvw%2Fb7WRhXq; ntes_kaola_ad=1; _ntes_nuid=a337f6067669934b539612e4546c2e47; NMTID=00ODtf13i_-O15UrUHav8qV3Oary4kAAAF-hLjBlA; WEVNSM=1.0.0; WNMCID=umuvvb.1648284444930.01.0; __snaker__id=x98ORWPPXkZ9lOM2; _9755xjdesxxd_=32; YD00000558929251%3AWM_TID=TpZb6B92TUhFAUBUFQPQW8NYSS%2FgIPFa; _ntes_nnid=a337f6067669934b539612e4546c2e47,1669790385901; gdxidpyhxdE=cyz6IOg7Uxon6wSZmiewzUmLAZ%2F8OYs7XNCe296DbbTat%2FPiEn%5CGAKrjkfEqalKij36rWShXolSCum1xbbVnkd8Q1yEXQQSN%2BUV36MXKUsS4IRaqJhMEnqsjpfzQbmdLzcCItltyUcf6%2BjanJU%5C5sls68Cz5V0M7OBelfgGeq9%2BXjQj9%3A1669894884263; YD00000558929251%3AWM_NI=cGiXcjeI1gu65DHesmY9%2BxmQ%2Fs50H1tM7OkUHmKetsymBSdAbQ5Fg2eArMU9rnzHpNMaWiRJPBWdgV8z97mI9GSJkx1W4scX%2FbBIHeliTBAFJmCLhb32JwKtCm6Jn4YrYkw%3D; YD00000558929251%3AWM_NIKE=9ca17ae2e6ffcda170e2e6eed1e945a3e7b8b2b452edb88ea7c54b878f8fb0d553a28da286b34a82ac8498b62af0fea7c3b92aa199a7b9e262a797ff88f83ef79c8886f2679be7e599f05bedadfbd1cb3bb893f9b0ea5f8cb38586f779bbb38eb4e74ba28ffba7e63aa79fbeaed833b2b2b6a9f3468fbf998ad142949e9985e65efca6f7d8f043fb999dabea74f389fc94e254edbe8eaacb6fb0b79ca3c44e8ab38dadeb6af1ee8698ca8081b3faabed409bae978cf637e2a3; NTES_YD_SESS=Z9DGBYpi6ViqcvdTgZY3.1WsVxZx4U5GSWHJn1I8erPSj0mKjiCG5_5HILspI40G1z63Uy9K4OCx8NCPmxT7EoPCYyLTr3UID6c21SuB5UVbTFb0ecnaEQSXE9qD8R20.dnJKKHZIl6b.KvJu92Hjs0JZ_xTNmJnUXHFRZ0HDKgoiol.v5HW1PPZuH1nBZKUOkACnDQTvh4MQjp8koiX3ku3yTiSplAPC; S_INFO=1669894052|0|0&60##|17503820063; P_INFO=17503820063|1669894052|1|music|00&99|null&null&null#hen&410100#10#0|&0|null|17503820063; __remember_me=true; JSESSIONID-WYYY=RQTkdtadi%2Fwaj1so0cozGCpI604pJVNb0OIjkcQX3y6n1h4o3WoU5N7f3aKBR2mf4k5qXT5djd9KCDjA%5Cyy%2BKx8xRyGd%2Fkr3iHW%2F8qa8C6Ysi%2F187UheM6gIyJkX62UvjRgs2Q2yqO32WWDBGMpKsvmS%5C%5CfsHqKylOriRqupN%5C1gU3jd%3A1669986488611; _iuqxldmzr_=32; MUSIC_U=d8914d3f82899371b7fe96a074e5cf1c10fdad52f9a59ddd27a743492670c0971e8907c67206e1eddbc18395ffe2b7a9d14bbd242af4bf95a2903c3245e5971efb70a5d20d97a08fd4dbf082a8813684; __csrf=c0de186fc371a21fdba5f893e7f57c5e; WM_NI=jjkVhf%2F8EL9YyiTNi4H7Psu1Kqfhl5scvEkU4Gwe7aHXdPn%2Feh4rHOE6sFrtTP320%2FliAA%2Ft6puCNrdR2bf1sksbOteGJFu3Y4QMHBp6qi%2FoQSUtZYSE0IEQ%2F%2FduIZ0bVW8%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6ee9bf049859aab90d83485968fb3c84a929e9aacd1698d928291bb5a98baa3d6c92af0fea7c3b92aaab6a5b7eb6eede88badbc53bbb79cafec408ce9a094f83b89afaa89ef3fb1bdbaa6ea5ff899b986b66b8c88acb1ed25a7b8fc93cb4587eabda7f1809890fdd3b325b0b78fa2ae80f6b0bba4cd7aa88efe83e53bb1b5bd83ce80a79986a7f8399bec9faecb4ab4eabf8aae65938d9b95d953919b00aac85bedf1ac96cc52f4be9ab8bb37e2a3'
          //wx.getStorageSync('cookies')
    },
      success:res=>{
        if(data.isLogin){
            // 将登陆cookies存入stoarge
            wx.setStorage({
                key:'cookies', 
                data:res.cookies?res.cookies:res.data.token
            })
        }
          resolve(res.data)
      },
      fail:err=>{
          console.log(err,host);
          reject(err)
      }
    
    })})
}