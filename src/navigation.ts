import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import ukPic from '@/../public/flags/united-kingdom.png'
import frPic from '@/../public/flags/france.png'
import esPic from '@/../public/flags/spain.png'

export const localesList = [
  {
    image: ukPic,
    label: 'English',
    locale: 'en',
  },
  {
    image: frPic,
    label: 'French',
    locale: 'fr',
  },
  {
    image: esPic,
    label: 'Spanish',
    locale: 'es',
  },
]

export const locales = localesList.map((l) => l.locale)
export const localePrefix = 'as-needed'

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales,
  localePrefix,
})
