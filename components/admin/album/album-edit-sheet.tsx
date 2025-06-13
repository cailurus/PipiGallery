'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { useButtonStore } from '~/app/providers/button-store-providers'
import type { AlbumType } from '~/types'
import type { HandleProps } from '~/types/props'
import { useSwrHydrated } from '~/hooks/use-swr-hydrated'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Button } from '~/components/ui/button'
import { Switch } from '~/components/ui/switch'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

export default function AlbumEditSheet(props : Readonly<HandleProps>) {
  const { mutate } = useSwrHydrated(props)
  const { albumEdit, album, setAlbumEdit, setAlbumEditData } = useButtonStore(
    (state) => state,
  )
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!album?.name || !album?.album_value) {
      toast.error('请先填写必填项！')
      return
    }
    if (album.album_value && album.album_value.charAt(0) !== '/') {
      toast.error('路由必须以 / 开头！')
      return
    }
    if (album.album_value === '/' && album.show === 1) {
      toast.warning('/ 路由不允许设置为不显示！')
      return
    }
    try {
      setLoading(true)
      const res = await fetch('/api/v1/albums/update', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(album),
        method: 'PUT',
      }).then(response => response.json())
      if (res.code === 200) {
        toast.success('更新成功！')
        setAlbumEditData({} as AlbumType)
        setAlbumEdit(false)
        await mutate()
      } else {
        toast.error(res.message)
      }
    } catch (e) {
      toast.error('更新失败！')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet
      defaultOpen={false}
      open={albumEdit}
      onOpenChange={(open: boolean) => {
        if (!open) {
          setAlbumEdit(false)
          setAlbumEditData({} as AlbumType)
        }
      }}
      modal={false}
    >
      <SheetContent side="left" className="w-full overflow-y-auto scrollbar-hide p-2" onInteractOutside={(event: any) => event.preventDefault()}>
        <SheetHeader>
          <SheetTitle>编辑相册</SheetTitle>
        </SheetHeader>
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
          >
            <span className="text-xs font-medium text-gray-700"> 相册名称 </span>

            <input
              type="text"
              id="name"
              value={album?.name}
              placeholder="输入相册名称"
              onChange={(e) => setAlbumEditData({...album, name: e.target.value})}
              className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
            />
          </label>
          <label
            htmlFor="album_value"
            className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
          >
            <span className="text-xs font-medium text-gray-700"> 路由 </span>

            <input
              type="text"
              id="album_value"
              value={album?.album_value}
              placeholder="输入路由，如：/tietie"
              onChange={(e) => setAlbumEditData({...album, album_value: e.target.value})}
              className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
            />
          </label>
          <label
            htmlFor="detail"
            className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
          >
            <span className="text-xs font-medium text-gray-700"> 详情 </span>

            <input
              type="text"
              id="detail"
              value={album?.detail}
              placeholder="输入详情"
              onChange={(e) => setAlbumEditData({...album, detail: e.target.value})}
              className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
            />
          </label>
          <label
            htmlFor="sort"
            className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
          >
            <span className="text-xs font-medium text-gray-700"> 排序 </span>

            <input
              type="number"
              id="sort"
              value={album?.sort}
              placeholder="0"
              onChange={(e) => setAlbumEditData({...album, sort: Number(e.target.value)})}
              className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
            />
          </label>
          <label
            htmlFor="detail"
            className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
          >
            <span className="text-xs font-medium text-gray-700"> 许可协议 </span>

          <input
            type="text"
            id="detail"
            value={album?.license}
            placeholder="CC BY-NC-SA 4.0"
            onChange={(e) => setAlbumEditData({...album, license: e.target.value})}
            className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
          />
          </label>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="flex flex-col gap-1">
              <div className="text-medium">显示状态</div>
              <div className="text-tiny text-default-400">
                是否需要在首页以路由形式呈现，点击后跳转页面。
              </div>
            </div>
            <Switch
              className="cursor-pointer"
              checked={album?.show === 0}
              onCheckedChange={(value) => {
                setAlbumEditData({...album, show: value ? 0 : 1})
              }}
            />
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="flex flex-col gap-1">
              <div className="text-medium">随机排序</div>
              <div className="text-tiny text-default-400">
                开启后，每次加载相册时会随机打乱图片顺序。
              </div>
            </div>
            <Switch
              className="cursor-pointer"
              checked={album?.random_show === 0}
              onCheckedChange={(value) => {
                setAlbumEditData({...album, random_show: value ? 0 : 1})
              }}
            />
          </div>
          <div className="flex flex-col gap-1 rounded-lg border p-3 shadow-sm">
            <div className="text-medium">相册内图片排序规则</div>
            <Select
              value={typeof album.image_sorting === 'number' ? album.image_sorting.toString() : '1'}
              onValueChange={(value) => {
                setAlbumEditData({
                  ...album,
                  image_sorting: parseInt(value),
                })
              }}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="选择排序规则" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem className="cursor-pointer" value="1">上传时间从新到旧</SelectItem>
                  <SelectItem className="cursor-pointer" value="2">拍摄时间从新到旧</SelectItem>
                  <SelectItem className="cursor-pointer" value="3">上传时间从旧到新</SelectItem>
                  <SelectItem className="cursor-pointer" value="4">拍摄时间从旧到新</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="cursor-pointer"
            disabled={loading}
            onClick={() => submit()}
            aria-label="更新"
          >
            {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>}
            更新
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
