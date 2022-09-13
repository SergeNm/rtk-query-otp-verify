import { useState } from 'react';
import OtpInput from './components/OtpInput';
import './App.css';
import { useChangeOtpMutation } from './features/api/apiSlice';

export default function App() {
  const [otp, setOtp] = useState('');
  const onChange = (value: string) => setOtp(value);

  const [changeOtp] = useChangeOtpMutation();
  const randomSixDigit = Math.floor(100000 + Math.random() * 900000).toString();

  return (
    <div className="container">
      <h1>React TypeScript OTP Input</h1>
      <OtpInput value={otp} valueLength={6} onChange={onChange} />
      <footer className="footer">
        <button onClick={() => changeOtp([randomSixDigit, 'user1'])}>
          resend otp
        </button>
      </footer>
    </div>
  );
}
