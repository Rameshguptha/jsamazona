import { forgotPwdValidate } from '../api';
import { getUserInfo, setUserInfo } from '../localStorage';
import { showLoading, hideLoading, showMessage, redirectUser,parseRequestUrl } from '../utils';

const SigninScreen = {
  after_render: () => {
  const request=parseRequestUrl()
    document
      .getElementById('pwdv-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        const email=request.id;
        const data = await forgotPwdValidate({
        //   email: document.getElementById('email').value,
            token:document.getElementById('token').value,
            email
        });
        hideLoading();
        if (data.error) {
          showMessage(data.error);
        } else {
          setUserInfo(data);
          // redirectUser();
          document.location.hash=`/setpwd/:${email}`
        }
      });
  },
  render: () => {
    if (getUserInfo().name) {
      redirectUser();
    }
    return `
    <div class="form-container">
      <form id="pwdv-form">
        <ul class="form-items">
          <li>
            <h1>Enter Your OTP</h1>
          </li>

          <li>
            <label for="token">Token</label>
            <input type="Number" name="token" id="token" />
          </li>
          <li>
            <button type="submit" class="primary">Verify Code</button>
          </li>
        </ul>
      </form>
    </div>
    `;
  },
};
export default SigninScreen;
