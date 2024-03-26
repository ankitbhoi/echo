import React from 'react'
import { useState } from 'react'
import Card from '../../../../components/Card/Card'
import Button from '../../../../components/shared/Button/Button'
import TextInput from '../../../../components/shared/TextInput/TextInput'
import styles from '../StepPhoneEmail.module.css'
import { sendOtp } from '../../../../http/index'
import { useDispatch }  from 'react-redux'
import { setOtp } from '../../../../store/authSlice'


const Phone = ({onNext}) => {

  const [phoneNumber, setPhoneNumber] = useState('');
  const dispatch = useDispatch();

  async function submit(){
    //server request
    if(!phoneNumber) {
      alert('Please fill all required fields');
      return;
    }
    const { data } = await sendOtp({phone: phoneNumber});
    console.log(data);
    dispatch(setOtp({phone: data.phone, hash: data.hash}));
    onNext();
  }

  return (
    <Card title="Enter your Phone Number" icon="phone">
      <TextInput value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
      <div>
        <div className={styles.actionButtonWrap}>
          <Button text="Next" onClick={submit}></Button>
        </div>
        <p className={styles.bottomParagraph}>
          By entering your number, you're agreeging to our Terms of Service and Privacy Policy. Thanks!
        </p>
      </div>
    </Card>
  )
}

export default Phone