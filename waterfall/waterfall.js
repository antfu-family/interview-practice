/**
 * 瀑布流布局类 - 可重用的瀑布流布局组件
 */
export class WaterfallLayout {
  /**
   * 创建瀑布流布局
   * @param {object} options - 配置选项
   * @param {Array<{url: string}>} options.imageList - 图片数据列表
   * @param {HTMLElement} options.container - 容器元素
   * @param {number} options.columnCount - 列数
   * @param {HTMLElement|null} options.loadingElement - 加载状态显示元素（可选）
   * @param {Function|null} options.onImageLoad - 图片加载完成回调（可选）
   * @param {number} options.gap - 图片间距（可选，默认16px）
   */
  constructor(options) {
    this.imageList = options.imageList || [] // 图片列表
    this.container = options.container // 容器元素
    this.columnCount = options.columnCount || 4 // 列数，默认为4
    this.loadingElement = options.loadingElement // 加载提示元素
    this.onImageLoad = options.onImageLoad // 图片加载完成回调
    this.gap = options.gap ?? 16 // 图片间距，默认16px

    // 内部状态
    this.columns = [] // 列容器
    this.columnHeights = [] // 列高度

    // 初始化
    this.init()
  }

  /**
   * 初始化瀑布流布局
   */
  init() {
    // 显示加载提示
    this.showLoading()

    // 清空容器
    this.container.innerHTML = ''

    // 创建列容器
    this.generateColumns()

    // 加载图片
    this.loadImages(this.imageList)
  }

  /**
   * 生成列容器
   */
  generateColumns() {
    this.columns = []
    this.columnHeights = Array.from({ length: this.columnCount }).fill(0)

    for (let i = 0; i < this.columnCount; i++) {
      const column = document.createElement('div')
      column.className = 'waterfall-column'
      column.style.cssText = `
        width: ${100 / this.columnCount}%;
        float: left;
        padding: 0 ${this.gap / 2}px;
      `
      this.container.appendChild(column)
      this.columns.push(column)
    }
  }

  /**
   * 显示加载提示
   */
  showLoading() {
    if (this.loadingElement) {
      this.loadingElement.classList.add('visible')
    }
  }

  /**
   * 隐藏加载提示
   */
  hideLoading() {
    if (this.loadingElement) {
      this.loadingElement.classList.remove('visible')
    }
  }

  /**
   * 加载图片
   */
  loadImages(list) {
    const promises = []

    // 遍历图片列表
    list.forEach((item) => {
      promises.push(new Promise((resolve) => {
        // 创建图片元素
        const imgEl = new Image()

        // 图片加载完成回调
        imgEl.onload = () => {
          this.mountImg(imgEl)
          resolve()
        }

        // 图片加载错误处理
        imgEl.onerror = () => {
          console.error('Image failed to load:', item.url)
          resolve()
        }

        // 开始加载图片
        imgEl.src = item.url
      }))
    })

    // 所有图片加载完成
    Promise.all(promises).then(() => {
      this.hideLoading()
    })
  }

  mountImg(imgEl) {
    // 获取最矮的列
    const minHeightIndex = this.findMinHeightColumnIndex()

    // 创建图片容器
    const imageItem = document.createElement('div')
    imageItem.className = 'image-item'
    // 计算图片在列中的高度（保持宽高比）
    const columnWidth = this.container.clientWidth / this.columnCount - this.gap // 减去padding
    const imgHeight = (columnWidth / imgEl.naturalWidth) * imgEl.naturalHeight

    // 将图片添加到容器
    imageItem.appendChild(imgEl)

    // 将容器添加到最矮的列
    this.columns[minHeightIndex].appendChild(imageItem)

    // 更新列高度
    this.columnHeights[minHeightIndex] += imgHeight + this.gap // 加上margin底部
  }

  /**
   * 查找高度最小的列索引
   * @returns {number} 高度最小的列索引
   */
  findMinHeightColumnIndex() {
    return this.columnHeights.indexOf(Math.min(...this.columnHeights))
  }

  /**
   * 更改列数
   * @param {number} newCount - 新的列数
   */
  changeColumnCount(newCount) {
    this.columnCount = newCount
    this.init()
  }

  /**
   * 添加更多图片
   * @param {Array<{url: string}>} newImages - 新的图片列表
   */
  addImages(newImages) {
    this.imageList = [...this.imageList, ...newImages]
    this.loadImages(newImages)
  }

  /**
   * 设置图片列表（替换当前列表）
   * @param {Array<{url: string}>} imageList - 图片列表
   */
  setImages(imageList) {
    this.imageList = imageList
    this.init()
  }

  /**
   * 销毁瀑布流实例，清理资源
   */
  destroy() {
    this.container.innerHTML = ''
    this.columns = []
    this.columnHeights = []
  }
}

window.WaterfallLayout = WaterfallLayout
