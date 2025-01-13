jest.mock('react-google-recaptcha', () => {
  const React = require('react')
  const RecaptchaV2 = React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      reset: jest.fn(),
      execute: () => {
        props.onChange('test-v2-token')
      },
    }))
    return <input ref={ref} data-testid='mock-v2-captcha-element' {...props} />
  })

  return RecaptchaV2
})

export {}
