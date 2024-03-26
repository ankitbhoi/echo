import React from 'react'
import { useState } from 'react'
import Card from '../../../components/Card/Card'
import TextInput from '../../../components/shared/TextInput/TextInput'
import Button from '../../../components/shared/Button/Button'
import styles from './StepOtp.module.css'
import { verifyOtp } from '../../../http'
import { useSelector } from 'react-redux'
import { setAuth } from '../../../store/authSlice'
import { useDispatch } from 'react-redux'


const StepOtp = ({onNext}) => {

  const [otp,setOtp] = useState('');
  const dispatch = useDispatch();
  const {phone, hash} = useSelector((state) => state.auth.otp);

  async function submit(){
    if(!otp || !phone || !hash) {
      alert('Please fill all required fields');
      return;
    }
    try{
      const { data } = await verifyOtp({ otp, phone, hash});
      console.log(data);
      dispatch(setAuth(data));
    }catch(err){
      console.log(err);
    }
    
  }

  return (
    <>
      <div className={styles.cardWrapper}>
        <Card title="Enter the code we just texted you" icon="lock">
          <TextInput value={otp} onChange={(e) => setOtp(e.target.value)}/>
          <div className={styles.actionButtonWrap}>
            <Button onClick={submit} text="Next"/>
          </div>
          <p className={styles.bottomParagraph}>
            By entering your number, you're agreegint to our Terms of Service and Privacy Policy. Thanks!
          </p>
        </Card>
      </div>
    </>
  )
}

export default StepOtp