'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/3d-editor')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">인테리어 3D 에디터</h1>
        <p className="text-slate-300">로딩 중...</p>
      </div>
    </div>
  )
}
