import { beforeAll, describe, expect, it } from 'vitest'
import { WaterfallLayout } from './waterfall.js'

describe('waterfall', () => {
  let oLoading

  beforeAll(() => {
    mockImage()
    mockCreateElement()


    oLoading = document.createElement('div')
  })

  it('should render images in waterfall layout with correct positioning', async () => {
    const imageScaleList = [
      { width: 300, height: 400 },
      { width: 300, height: 100 },
      { width: 300, height: 400 },
      { width: 300, height: 400 },
      { width: 300, height: 200 },
    ]
    const imageList = createImageList(imageScaleList)
    const oContainer = createContainer()
    const waterfallIns = new WaterfallLayout({
      imageList,
      gap: 0,
      columnCount: 4,
      container: oContainer,
      loadingElement: oLoading,
    })
    // 使用宏任务阻塞，保证微任务都执行完毕后，再执行后续测试
    await frushPromises()

    // 校验元素是否都被渲染
    // 校验列元素是否被正确渲染
    expect(oContainer._children.length).toBe(4)
    expect(oContainer._children.map(el => el.className)).toEqual(createArray(4, 'waterfall-column'))
    // 校验图片是否被正确渲染
    const imgContainers = oContainer._children.map(column => column._children).flat()
    // 测试图片容器数量是否准确
    expect(imgContainers.length).toBe(imageScaleList.length)
    expect(imgContainers.map(el => el.className)).toEqual(createArray(imageScaleList.length, 'image-item'))
    // 测试图片是否被正确渲染
    expect(imgContainers.map(el => el._children.length)).toEqual(createArray(imgContainers.length, 1))
    expect(imgContainers.map(el => el._children[0].tagName)).toEqual(createArray(imageScaleList.length, 'IMG'))
    // 校验图片位置是否正确
    expect(waterfallIns.findMinHeightColumnIndex()).toBe(1)
    expect(oContainer._children[0]._children.length).toBe(1)
    expect(oContainer._children[1]._children.length).toBe(2)
    expect(oContainer._children[2]._children.length).toBe(1)
    expect(oContainer._children[3]._children.length).toBe(1)
  })

  it('should dynamically update the layout when column count changes', async () => {
    const imageScaleList = [
      { width: 300, height: 400 },
      { width: 300, height: 100 },
      { width: 300, height: 400 },
      { width: 300, height: 400 },
      { width: 300, height: 200 },
    ]
    const imageList = createImageList(imageScaleList)
    const oContainer = createContainer()
    const waterfallIns = new WaterfallLayout({
      imageList,
      gap: 0,
      columnCount: 4,
      container: oContainer,
      loadingElement: oLoading,
    })
    // 使用宏任务阻塞，保证微任务都执行完毕后，再执行后续测试
    await frushPromises()

    // 校验列元素是否被正确渲染
    expect(oContainer._children.length).toBe(4)
    waterfallIns.changeColumnCount(5)
    await frushPromises()
    expect(oContainer._children.length).toBe(5)
  })

  it('should dynamically update the layout when add new images', async () => {
    const imageScaleList = [
      { width: 300, height: 400 },
      { width: 300, height: 100 },
      { width: 300, height: 400 },
      { width: 300, height: 400 },
      { width: 300, height: 200 },
    ]
    const imageList = createImageList(imageScaleList)
    const oContainer = createContainer()
    const waterfallIns = new WaterfallLayout({
      imageList,
      gap: 0,
      columnCount: 4,
      container: oContainer,
      loadingElement: oLoading,
    })
    // 使用宏任务阻塞，保证微任务都执行完毕后，再执行后续测试
    await frushPromises()

    const newImageList = [
      { width: 300, height: 300 }
    ];
    waterfallIns.addImages(createImageList(newImageList))
    await frushPromises()
    // 校验图片是否被正确渲染
    const imgContainers = oContainer._children.map(column => column._children).flat()
    const newImageLength = imageScaleList.length + newImageList.length
    expect(waterfallIns.imageList).toEqual(createImageList([
      ...imageScaleList,
      ...newImageList
    ]))
    expect(imgContainers.length).toBe(newImageLength)
    expect(imgContainers.map(el => el.className)).toEqual(createArray(newImageLength, 'image-item'))
    expect(imgContainers.map(el => el._children.length)).toEqual(createArray(imgContainers.length, 1))
    expect(imgContainers.map(el => el._children[0].tagName)).toEqual(createArray(newImageLength, 'IMG'))
    // 测试添加图片之后位置是否正确
    expect(waterfallIns.findMinHeightColumnIndex()).toBe(0)
    expect(oContainer._children[0]._children.length).toBe(1)
    expect(oContainer._children[1]._children.length).toBe(3)
    expect(oContainer._children[2]._children.length).toBe(1)
    expect(oContainer._children[3]._children.length).toBe(1)
  })

  it('should dynamically update the layout when image list changes', async () => {
    const imageScaleList = [
      { width: 300, height: 400 },
      { width: 300, height: 100 },
      { width: 300, height: 400 },
      { width: 300, height: 400 },
      { width: 300, height: 200 },
    ]
    const imageList = createImageList(imageScaleList)
    const oContainer = createContainer()
    const waterfallIns = new WaterfallLayout({
      imageList,
      gap: 0,
      columnCount: 4,
      container: oContainer,
      loadingElement: oLoading,
    })
    // 使用宏任务阻塞，保证微任务都执行完毕后，再执行后续测试
    await frushPromises()

    waterfallIns.setImages(createImageList([
      { width: 300, height: 300 },
      { width: 300, height: 200 },
      { width: 300, height: 100 },
      { width: 300, height: 500 }
    ]))
    await frushPromises()
    // 测试更新imageList之后位置是否正确
    expect(waterfallIns.findMinHeightColumnIndex()).toBe(2)
    expect(oContainer._children[0]._children.length).toBe(1)
    expect(oContainer._children[1]._children.length).toBe(1)
    expect(oContainer._children[2]._children.length).toBe(1)
    expect(oContainer._children[3]._children.length).toBe(1)
  })
})

function createImageList(list) {
  return list.map(({ width, height }) => ({
    url: `https://picsum.photos/${width}/${height}`,
  }))
}

function mockImage() {
  window.Image = function () {
    return new Proxy({
      tagName: 'IMG',
      onload() { },
      onerror() { },
      src: '',
      naturalWidth: 800,
      naturalHeight: 600,
    }, {
      get(target, key, receiver) {
        return Reflect.get(target, key, receiver)
      },
      set(target, key, value, receiver) {
        // 给img添加src时，立即触发onload事件
        if (key === 'src') {
          const height = Number.parseInt(value.split('/').at(-1))
          target.naturalHeight = height
          receiver.onload()
        }
        return Reflect.set(target, key, value, receiver)
      },
    })
  }
}

function mockCreateElement() {
  const createElement = document.createElement.bind(document)
  document.createElement = function (tag) {
    const el = createElement(tag)
    el.appendChild = (child) => {
      if (!el._children) {
        el._children = [child]
      }
      else {
        el._children.push(child)
      }
    }
    return el
  }
}

function createContainer() {
  const oContainer = document.createElement('div')
  let innerHTML = oContainer.innerHTML
  // 设置容器宽度为1200px
  Object.defineProperty(oContainer, 'clientWidth', {
    get() {
      return 1200
    },
  })
  Object.defineProperty(oContainer, 'innerHTML', {
    get () {
      return innerHTML
    },
    set (value) {
      // 当清空innerHTML时，将_children置空
      if (value === '') {
        this._children = []
      }
      innerHTML = value
    }
  })
  return oContainer
}

function createArray(length, initialValue) {
  return Array.from({ length }).fill(initialValue)
}

function frushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0))
}
