import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function AuthInput({ icon: Icon, type = 'text', ...props }) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="input-wrap">
      <Icon className="input-icon" size={18} />
      <input
        aria-label={props.placeholder}
        {...props}
        type={isPassword && visible ? 'text' : type}
      />
      {isPassword && (
        <button
          type="button"
          className="eye-btn"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  )
}

export default AuthInput