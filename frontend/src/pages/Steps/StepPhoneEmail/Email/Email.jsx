import React from 'react'
import { useState } from 'react'
import Card from '../../../../components/Card/Card'
import Button from '../../../../components/shared/Button/Button'
import TextInput from '../../../../components/shared/TextInput/TextInput'
import styles from '../StepPhoneEmail.module.css'

const Email = ({onNext}) => {
  const [email, setEmail] = useState('');

  return (
    <Card title="Enter your Email ID" icon="mail">
      <TextInput value={email} onChange={(e) => setEmail(e.target.value)}/>
      <div>
        <div>
          <div className={styles.actionButtonWrap}>
            <Button text="Next" onClick={onNext}></Button>
          </div>
          <p className={styles.bottomParagraph}>
            By entering your number, you're agreeging to our Terms of Service and Privacy Policy. Thanks!
          </p>
        </div>
      </div>
    </Card>
  )
}

export default Email