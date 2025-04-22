'use client'
import {useRef, useState, useEffect, type KeyboardEvent, type ChangeEvent} from 'react'
import {Search} from 'lucide-react'
import {Input} from '@/components/ui/input'
import {useRouter} from 'next/navigation'
import {Button} from '@/ui/button'
import {useQueryStates} from 'nuqs'
import {pageSearchParams} from '@/hooks/use-search-params'
import {api} from '@/trpc/react'

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

    if (newValue === '') {
      handleSearch('')
    }
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
        <div className='absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-md border bg-white p-2 shadow-lg dark:bg-zinc-900'>
          {isPending && <div className='text-center'>Loading...</div>}
          {data?.map((product) => (
            <Button
              key={product.id}
              onClick={() => {
                router.push(`/search?searchTerm=${product.name}`)
              }}
            >
              {product.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
