import { setPwd } from '../api';
import { getUserInfo, setUserInfo } from '../localStorage';
import { showLoading, hideLoading, showMessage, redirectUser,parseRequestUrl } from '../utils';

const forgotPwdScreen = {
  after_render: () => {
  const request=parseRequestUrl()

    document
      .getElementById('spwd-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        
        const data = await setPwd({email:request.id,
          nPassword:document.getElementById('password').value,
          cPassword:document.getElementById('cpassword').value,
        //   password: document.getElementById('password').value,
        });
        hideLoading();
        if (data.error) {
          showMessage(data.error);
        } else {
          setUserInfo(data);
        //   redirectUser();
        document.location.hash=`/signin`
        }
      });
  },
  render: () => {
    if (getUserInfo().name) {
      redirectUser();
    }
    return `
    <div class="form-container">
      <form id="spwd-form">
        <ul class="form-items">
          <li>
            <h1>Set Your Password</h1>
          </li>
          <li>
            <label for="pwd">Password</label>
            <input type="password" name="password" id="password" />
          </li>
          <li>
          <label for="cpwd">Confirm Password</label>
          <input type="password" name="cpassword" id="cpassword" />
        </li>

          <li>
            <button type="submit" class="primary">Set Password</button>
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
