// 生成测试图片数据
export function generateImageUrls(count) {
  const images = []
  for (let i = 0; i < count; i++) {
    // 随机宽高，但保持合理的比例
    const width = 200 + Math.floor(Math.random() * 200)
    const height = 200 + Math.floor(Math.random() * 400)
    // 添加随机参数避免缓存
    const url = `https://picsum.photos/${width}/${height}?random=${Date.now() + i}`
    images.push({ url })
  }
  return images
}
