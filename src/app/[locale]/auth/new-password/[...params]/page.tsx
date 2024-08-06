import AuthCard from '@/components/cards/auth-card'
import NewPasswordForm from '@/components/forms/new-password-form'

const NewPasswordPage = () => {
  return (
    <AuthCard title={'New Password'} desc={'Create a new password'}>
      <NewPasswordForm />
    </AuthCard>
  )
}

export default NewPasswordPage
