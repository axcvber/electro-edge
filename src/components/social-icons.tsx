import { Facebook, Instagram, Twitter } from 'lucide-react'
import { useInitialData } from '@/hooks/use-initial-data'

interface ComponentMapping {
  [key: string]: React.FunctionComponent
}

const componentMapping: ComponentMapping = {
  'instagram': Instagram,
  'facebook': Facebook,
  'twitter': Twitter,
}

const getSocialIcon = (iconName: string) => {
  const Icon = iconName ? componentMapping[iconName] : null
  return Icon ? <Icon /> : null
}

const SocialIcons = () => {
  const { contacts } = useInitialData()

  const data = contacts?.fields.social_icons

  return (
    <ul className='flex gap-4 items-center '>
      {data?.map((item, inx) => (
        <li key={inx}>
          <a
            className='[&_svg]:w-4 [&_svg]:h-4 hover:text-white/80'
            href={item.fields.link}
            target='_blank'
            rel='noopener noreferrer'
          >
            {getSocialIcon(item.fields.icon_name)}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default SocialIcons
