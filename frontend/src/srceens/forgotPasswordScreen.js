import { forgotPwdGen } from '../api';
import { getUserInfo, setUserInfo } from '../localStorage';
import { showLoading, hideLoading, showMessage, redirectUser } from '../utils';

const forgotPwdScreen = {
  after_render: () => {
    document
      .getElementById('fpd-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        const data = await forgotPwdGen({
          email: document.getElementById('email').value,
        //   password: document.getElementById('password').value,
        });
        hideLoading();
        if (data.error) {
          showMessage(data.error);
        } else {
          setUserInfo(data);
        //   redirectUser();
        document.location.hash = '/forgotvalidate';

        }
      });
  },
  render: () => {
    if (getUserInfo().name) {
      redirectUser();
    }
    return `
    <div class="form-container">
      <form id="fpd-form">
        <ul class="form-items">
          <li>
            <h1>Enter your Email</h1>
          </li>
          <li>
            <label for="email">Email</label>
            <input type="email" name="email" id="email" />
          </li>

          <li>
            <button type="submit" class="primary">Click Here To Send Otp</button>
          </li>
          <li>
            <div>
              New User?
              <a href="/#/register">Create your account </a>
            </div>
            <div>
            Forgot Password?
            
            <a href="/#/forgotvalidate">Click Here hhh</a>
            </div>
          </li>
        </ul>
      </form>
    </div>
    `;
  },
};
export default forgotPwdScreen;
