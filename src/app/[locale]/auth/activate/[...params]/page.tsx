import AuthCard from '@/components/cards/auth-card'
import ActivateAccForm from '@/components/forms/activate-acc-form'

const ActivateAccPage = () => {
  return (
    <AuthCard title={'Activate account'} desc={'Create your password to activate your account.'}>
      <ActivateAccForm />
    </AuthCard>
  )
}

export default ActivateAccPage
