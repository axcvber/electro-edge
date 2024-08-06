const verifyEndpoint = 'https://www.google.com/recaptcha/api/siteverify'

export const captchaValidation = async (token: string) => {
  const captchaResponse = await fetch(verifyEndpoint, {
    method: 'POST',
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY!,
      response: token,
    }),
  }).then((res) => res.json())
  if (!captchaResponse.success) {
    throw new Error('Unprocessable request, Invalid captcha code')
  }
}
