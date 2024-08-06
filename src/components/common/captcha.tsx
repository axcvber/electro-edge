import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

interface CaptchaProps {
  onChange?: (token: string | null) => void
}

const Captcha = React.forwardRef<ReCAPTCHA, CaptchaProps>(({ onChange }, ref) => (
  <ReCAPTCHA
    ref={ref}
    size='invisible'
    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
    onChange={onChange}
    className='hidden'
  />
))

Captcha.displayName = 'Captcha'

export { Captcha }
