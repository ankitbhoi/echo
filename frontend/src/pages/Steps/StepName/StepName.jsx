import React, { useState } from 'react'
import Card from '../../../components/Card/Card'
import Button from '../../../components/shared/Button/Button'
import TextInput from '../../../components/shared/TextInput/TextInput'
import { useDispatch, useSelector } from 'react-redux'
import { setName } from '../../../store/activateSlice'
import styles from './StepName.module.css'

const StepName = ({onNext}) => {
  const { name } = useSelector(state => state.activate);
  const dispatch = useDispatch();
  const [fullname, setFullname] = useState(name);

  function nextStep(){
    if(!fullname){
      alert('Please fill all required fields');
      return;
    }

    dispatch(setName(fullname));
    onNext();
  }

  return (
    <>
      <Card title="What's your full name?" icon="chashmish">
        <TextInput value={fullname} onChange={(e) => setFullname(e.target.value)}/>        
        <p className={styles.paragraph}>
          People use real names at Echoverse :)
        </p>
        <div>
          <Button onClick={nextStep} text="Next"/>
        </div>
      </Card>
    </>
  )
}

export default StepName