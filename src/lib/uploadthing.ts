import {generateUploadButton, generateUploadDropzone} from '@uploadthing/react'

import type {OurFileRouter} from '@/app/api/uploadthing/core'
import {type ClientUploadedFileData} from 'uploadthing/types'

export const UploadButton = generateUploadButton<OurFileRouter>()
export const UploadDropzone = generateUploadDropzone<OurFileRouter>()

export type ProfileImageUploadResponse = ClientUploadedFileData<{imageUrl: string}>[]
export type ProductImageUploadResponseSingle = ClientUploadedFileData<{imageUrl: string; assetId: number}>
export type ProductImageUploadResponse = ProductImageUploadResponseSingle[]
