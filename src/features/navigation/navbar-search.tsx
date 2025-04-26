'use client'
import {useRef, useState, useEffect, type KeyboardEvent, type ChangeEvent} from 'react'
import {Loader2, Search} from 'lucide-react'
import {Input} from '@/components/ui/input'
import {useRouter} from 'next/navigation'
import {Button} from '@/ui/button'
import {useQueryStates} from 'nuqs'
import {pageSearchParams} from '@/hooks/use-search-params'
import {api} from '@/trpc/react'
import Link from 'next/link'
import Image from 'next/image'

export default function NavbarSearch() {
  const router = useRouter()
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [{searchTerm}, setSearchParams] = useQueryStates(pageSearchParams, {shallow: false})
  const {data, isPending} = api.products.getSearchTermProducts.useQuery({
    searchTerm: searchTerm,
  })

  const handleSearch = (term: string) => {
    if (term.trim()) {
      router.push(`/search?searchTerm=${encodeURIComponent(term)}`)
    }
    inputRef.current?.blur()
    setIsFocused(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm)
    }
  }

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    await setSearchParams({searchTerm: newValue})

    // if (newValue === '') {
    //   handleSearch('')
    // }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className='relative w-full' ref={containerRef}>
      <Button
        size={'icon'}
        className='absolute right-2 top-[0.4rem] z-10 size-7 rounded-lg'
        onClick={() => handleSearch(searchTerm)}
      >
        <Search />
      </Button>
      <Input
        ref={inputRef}
        type='search'
        placeholder='Search...'
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
        className='w-full p-5 pr-11 text-black ring-1 dark:text-white'
      />

      {isFocused && (
        <div className='absolute z-20 -ml-20 mt-1 max-h-screen max-w-[100vw] space-y-4 overflow-y-auto rounded-md border bg-background p-5 shadow-lg sm:ml-0 sm:w-full lg:ml-0'>
          {isPending ? (
            <div className='flex items-center justify-center gap-3'>
              <Loader2 className='animate-spin' />
              <span> Loading...</span>
            </div>
          ) : (
            <div className='flex flex-col gap-5'>
              <h2 className='mb-2 border-b text-xl font-semibold'>Product selection</h2>
              <div className='flex gap-3 overflow-x-auto p-2'>
                {data?.map((product) => (
                  <Link href={`/product/${product.id}`} key={product.id}>
                    <div
                      className='relative aspect-square size-20 cursor-pointer'
                      onClick={() => {
                        setIsFocused(false)
                        inputRef.current?.blur()
                      }}
                    >
                      <Image
                        src={product.assets[0]?.asset.fileInfo?.url || ''}
                        alt='Product Image'
                        fill
                        className='rounded-full object-cover'
                      />
                    </div>
                  </Link>
                ))}
              </div>
              <div>
                <div className='flex flex-col gap-2'>
                  <h2 className='mb-2 border-b text-xl font-semibold'>Results</h2>
                  {data?.map((product) => (
                    <Link href={`/search?searchTerm=${product.name}`} key={product.id}>
                      {product.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
