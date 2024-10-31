"use client"

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ChangeEvent } from 'react'
import { Globe } from 'lucide-react';


export default function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const toggle = locale === 'en' ? 'es' : 'en'

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const newLocale = event.target.value
    router.push(`/${newLocale}`)
  }

  function onClickChange() {
    router.push(`/${toggle}`)
  }


  return (
<div className="flex items-center space-x-2 lg:justify-end">
  <button className="text-white xl:hidden " onClick={onClickChange}>{locale} <Globe className="w-5 h-5 text-blue-300" /> </button>

  <label htmlFor="locale" className="hidden xl:block text-white">
    <Globe className="w-5 h-5 text-blue-300" />
  </label>

  <select
    name="locale"
    onChange={onSelectChange}
    value={locale}
    className="hidden xl:block bg-black bg-opacity-50 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
  >
    <option value="en">English</option>
    <option value="es">Español</option>
  </select>
</div>

  )
}