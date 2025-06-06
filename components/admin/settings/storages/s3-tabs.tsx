'use client'

import { Card } from '~/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Button } from '~/components/ui/button'
import { ReloadIcon } from '@radix-ui/react-icons'
import React from 'react'
import useSWR from 'swr'
import { fetcher } from '~/lib/utils/fetcher'
import { toast } from 'sonner'
import { useButtonStore } from '~/app/providers/button-store-providers'
import S3EditSheet from '~/components/admin/settings/storages/s3-edit-sheet'

export default function S3Tabs() {
  const { data, error, isValidating, mutate } = useSWR('/api/v1/settings/s3-info', fetcher
    , { revalidateOnFocus: false })
  const { setS3Edit, setS3EditData } = useButtonStore(
    (state) => state,
  )

  if (error) {
    toast.error('请求失败！')
  }

  return (
    <div className="space-y-2">
      <Card className="py-0">
        <div className="flex justify-between p-2">
          <div className="flex gap-5">
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">S3 配置</h4>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              disabled={isValidating}
              onClick={() => mutate()}
              aria-label="刷新"
            >
              {isValidating && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              刷新
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setS3Edit(true)
                setS3EditData(JSON.parse(JSON.stringify(data)))
              }}
              aria-label="编辑"
            >
              编辑
            </Button>
          </div>
        </div>
      </ Card>
      {
        data &&
        <Card className="p-2">
          <Table aria-label="S3 设置">
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.config_key}</TableCell>
                  <TableCell className="truncate max-w-48">{item.config_value || 'N&A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      }
      {Array.isArray(data) && data.length > 0 && <S3EditSheet />}
    </div>
  )
}