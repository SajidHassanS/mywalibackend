const companyName = process.env.PROJECT_NAME;
const incorporationName = process.env.INCORPORATION_NAME;
const officeAddress = process.env.OFFICE_ADDRESS;
const officePhone = process.env.OFFICE_PHONE;

const clientUrl = process.env.ADMIN_URL;

const setNewPasswordSuccessfully = () => {
  return `<div style="width:100%;margin:0;padding:0;line-height:1.6">

    <table align="center" border="0" cellpadding="0" cellspacing="0" width="640"
      style="width:640px;margin:0 auto;font-family:Arial,Helvetica,sans-serif">
      <tbody>
        <tr>
          <td align="center" width="640px" style="padding-top:30px;width:600px;margin:0 auto">
  
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tbody>
  
                <tr>
                  <td align="center" style="    padding-top: 22px;;padding-bottom:30px;background-color: #f7fbff;
                    border-bottom: 3px solid #0d2b5d;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="540"
                      style="font-family:Helvetica,Arial,sans-serif;line-height:1.6;text-align:left;font-size:16px;color:#666666;border-collapse:collapse;">
                      <tbody>
  
                </tr>
                <tr>
                  <td align="left"
                    style="    padding-bottom: 30px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; ">
                    <h1
                      style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px; color:#002054f2">
                      password change for  ${companyName} portal</h1>
                  </td>
                </tr>
                <tr>
                  <td align="left"
                    style="    padding-bottom: 26px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0;"> Cheers ,
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="left"
                    style="    padding-bottom: 26px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="    margin-bottom: 40px;
                      ">You have successfully changed your password.
                    </p>
                  </td>
                </tr>
  
  
                <tr>
                  <td style="text-align: center;     padding-bottom: 10px;">
                    <a href="${clientUrl}" style="background: #0c5890;
                      color: white;
                      padding: 15px 35px;
                      border-radius: 3px;    text-decoration: none;
                      border: none;cursor: pointer;" target="_blank">
                      Login</a>
                  </td>
                </tr>
  
                <tr>
                  <td align="left"
                    style="padding-top: 25px;     padding-bottom: 3px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:
                    </p>
                    <p style="margin: 0;"><a href="${clientUrl}" style="color: #1a82e2;" target="_blank">Login</a></p>
                  </td>
                </tr>
                <tr>
                  <td align="left"
                    style="padding-top: 25px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0;"><strong>Note: </strong> We strongly advise you to change your password
                      frequently. Enjoy your stay at ${companyName} Portal!
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="left"
                    style="padding-top: 50px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;">
                    <p style="margin: 0; line-height: 1.5;
                      color: #585858;
                      font-size: 14px;">${incorporationName}, Inc.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
  
        <tr>
          <td align="center" width="100%" style="padding-top:35px;padding-bottom:35px">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="470">
              <tbody>
  
                <tr>
                  <td align="center"
                    style="
                              padding-bottom: 10px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 20px; color: #9E9E9E;">
                    <p style="margin: 0;">${incorporationName}, Inc.</p>
                    <p style="margin: 0;">${officeAddress}. Sales |
                      ${officePhone}</p>
                  </td>
                </tr>
  
  
  
                <tr>
                  <td align="center">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="160">
                      <tbody>
                        <tr>
  
                          <td width="40">
                            <a href="#">
                              <img
                                src="https://ci4.googleusercontent.com/proxy/qbSosIkVPh0t1TY17id2mSdN2c7LqC6Nt3GzUcOxgjpVKNskoPmhrHrQismiHjDRIZNVP4RtTLsHop6BAEAziC1TLZHjLyQR0_U0azAgHQ83fer-dT8SSSN6BjGX1gQOB4FX3cc=s0-d-e1-ft#https://storage.googleapis.com/switch_static/email/common/footer_icon_facebook.png"
                                alt="Facebook" border="0" height="30" width="30"
                                style="width:30px;height:30px;border:0;display:block" class="CToWUd">
                            </a>
                          </td>
  
  
                          <td width="40">
                            <a href="#">
                              <img
                                src="https://ci3.googleusercontent.com/proxy/NAgVRUj88e9odoWkqTD5mLiFekiH5C69f0DPokMW4xiV_TNv77GMYqT3AbxbPktiLxlosL_H28wKBbNGdjXG_1NocItFK7_QehHxdwmPh7zGvmDgfq6EBVmT8cDBolJThvXZKg=s0-d-e1-ft#https://storage.googleapis.com/switch_static/email/common/footer_icon_twitter.png"
                                alt="Twitter" border="0" height="30" width="30"
                                style="width:30px;height:30px;border:0;display:block" class="CToWUd">
                            </a>
                          </td>
  
  
                          <td width="40">
                            <a href="#">
                              <img
                                src="https://ci5.googleusercontent.com/proxy/IryAnyzKiJqfMAFvgqR9-B44DRYH1UR7Cc16QEV1DEBTJOH9AD9vPqXLs7uU6eJfTjkEII9ZfWOQPbPCXPXgsGUptcDFpjnzGgCyoSiS2IfmgYE38eQzenps72y7ULuV2dNlc0g=s0-d-e1-ft#https://storage.googleapis.com/switch_static/email/common/footer_icon_linkedin.png"
                                alt="LinkedIn" border="0" height="30" width="30"
                                style="width:30px;height:30px;border:0;display:block" class="CToWUd">
                            </a>
                          </td>
  
  
                          <td width="40">
                            <a href="#">
                              <img
                                src="https://ci4.googleusercontent.com/proxy/ZX386H2JYefqPQdH9SLflpvMWTA1jZNNyLhNYuclmPJFDZoIUn1CFikBWG1LEKfMvbiYGCHir1pTZffVDwaYtA6esYBaqRgiT1JtdvWVWUZ4FhHFSKNW2jujprPxnaQN7e3Y=s0-d-e1-ft#https://storage.googleapis.com/switch_static/email/common/footer_icon_g_plus.png"
                                alt="Google+" border="0" height="30" width="30"
                                style="width:30px;height:30px;border:0;display:block" class="CToWUd">
                            </a>
                          </td>
  
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
  
              </tbody>
            </table>
          </td>
        </tr>
  
      </tbody>
    </table>
  
    </td>
    </tr>
    </tbody>
    </table>
  </div>`;
};

const forgetPasswordEmail = (url) => {
  return `<div style="width:100%;margin:0;padding:0;line-height:1.6">
  
  
  
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="640"
      style="width:640px;margin:0 auto;font-family:Arial,Helvetica,sans-serif">
      <tbody>
        <tr>
          <td align="center" width="640px" style="padding-top:30px;width:600px;margin:0 auto">
  
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tbody>
  
                  <tr>
                  <td align="center" style="    padding-top: 22px;;padding-bottom:30px;background-color: #f7fbff;
                  border-bottom: 3px solid #0d2b5d;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="540"
                      style="font-family:Helvetica,Arial,sans-serif;line-height:1.6;text-align:left;font-size:16px;color:#666666;border-collapse:collapse;">
                      <tbody>
  
                </tr>
                <tr>
                  <td align="left"
                    style="    padding-bottom: 30px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; ">
                    <h1
                      style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px; color:#002054f2">
                      Password Reset Email</h1>
                  </td>
                </tr>
                <tr>
                  <td align="left"
                    style="    padding-bottom: 26px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0;"> Forgot your password <strong> Don't worry we are here to help </strong>,
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="left"
                    style="    padding-bottom: 26px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0;">You have received this email because you or somebody else on your behalf has requested to reset your ${companyName} Portal password. If you have not initiated this request then ignore this email. If request is initiated by you then please follow below instruction to proceed further. 
                    </p>
                    <p></p>
                    <p style="margin: 0;">Click the button below to initiate password reset functionality.
                    </p>
                  </td>
                </tr>
  
  
                <tr>
                <td style="text-align: center;     padding-bottom: 30px;">
                  <a href="${url}" style="background: #0c5890;
                  color: white;
                  padding: 15px 35px;
                  border-radius: 3px;    text-decoration: none;
                  border: none;cursor: pointer;" target="_blank">
                   Reset Password</a>
                </td>
              </tr>
  
                <tr>
                  <td align="left"
                    style="padding-top: 25px;     padding-bottom: 3px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:
                    </p>
                    <p style="margin: 0;"><a href="${url}" style="color: #1a82e2;" target="_blank">${url}</a></p>
                  </td>
                </tr>
                <tr>
                  <td align="left"
                    style="padding-top: 50px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;">
                    <p style="margin: 0; line-height: 1.5;
                    color: #585858;
                    font-size: 14px;">Admin, ${companyName} platform<br> Cheers</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
  
  
  
        <tr>
          <td align="center" width="100%" style="padding-top:35px;padding-bottom:35px">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="470">
              <tbody>
                <tr>
                  <td align="center"
                    style=" font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #9E9E9E;">
                    <p style="margin: 0;">You received this email because we got a request from your email to initiate password recovery for your account.If you didn't request the password recovery option you can safely delete this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center"
                    style="    padding-top: 30px;
                            padding-bottom: 10px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 20px; color: #9E9E9E;">
                    <p style="margin: 0;">${companyName} Portal.</p>
                    <p style="margin: 0;">${officeAddress} <br>. Admin |
                                       ${officePhone}</p>
                  </td>
                </tr>
  
  
  
                <tr>
                  <td align="center">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="160">
                      <tbody>
                        <tr>
  
                          <td width="40">
                            <a href="#">
                              <img
                                src="https://ci4.googleusercontent.com/proxy/qbSosIkVPh0t1TY17id2mSdN2c7LqC6Nt3GzUcOxgjpVKNskoPmhrHrQismiHjDRIZNVP4RtTLsHop6BAEAziC1TLZHjLyQR0_U0azAgHQ83fer-dT8SSSN6BjGX1gQOB4FX3cc=s0-d-e1-ft#https://storage.googleapis.com/switch_static/email/common/footer_icon_facebook.png"
                                alt="Facebook" border="0" height="30" width="30"
                                style="width:30px;height:30px;border:0;display:block" class="CToWUd">
                            </a>
                          </td>
  
  
                          <td width="40">
                            <a href="#">
                              <img
                                src="https://ci3.googleusercontent.com/proxy/NAgVRUj88e9odoWkqTD5mLiFekiH5C69f0DPokMW4xiV_TNv77GMYqT3AbxbPktiLxlosL_H28wKBbNGdjXG_1NocItFK7_QehHxdwmPh7zGvmDgfq6EBVmT8cDBolJThvXZKg=s0-d-e1-ft#https://storage.googleapis.com/switch_static/email/common/footer_icon_twitter.png"
                                alt="Twitter" border="0" height="30" width="30"
                                style="width:30px;height:30px;border:0;display:block" class="CToWUd">
                            </a>
                          </td>
  
  
                          <td width="40">
                            <a href="#">
                              <img
                                src="https://ci5.googleusercontent.com/proxy/IryAnyzKiJqfMAFvgqR9-B44DRYH1UR7Cc16QEV1DEBTJOH9AD9vPqXLs7uU6eJfTjkEII9ZfWOQPbPCXPXgsGUptcDFpjnzGgCyoSiS2IfmgYE38eQzenps72y7ULuV2dNlc0g=s0-d-e1-ft#https://storage.googleapis.com/switch_static/email/common/footer_icon_linkedin.png"
                                alt="LinkedIn" border="0" height="30" width="30"
                                style="width:30px;height:30px;border:0;display:block" class="CToWUd">
                            </a>
                          </td>
  
  
                          <td width="40">
                            <a href="#">
                              <img
                                src="https://ci4.googleusercontent.com/proxy/ZX386H2JYefqPQdH9SLflpvMWTA1jZNNyLhNYuclmPJFDZoIUn1CFikBWG1LEKfMvbiYGCHir1pTZffVDwaYtA6esYBaqRgiT1JtdvWVWUZ4FhHFSKNW2jujprPxnaQN7e3Y=s0-d-e1-ft#https://storage.googleapis.com/switch_static/email/common/footer_icon_g_plus.png"
                                alt="Google+" border="0" height="30" width="30"
                                style="width:30px;height:30px;border:0;display:block" class="CToWUd">
                            </a>
                          </td>
  
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
  
              </tbody>
            </table>
          </td>
        </tr>
  
      </tbody>
    </table>
  
    </td>
    </tr>
    </tbody>
    </table>
  </div>
`;
};

module.exports = {
  forgetPasswordEmail,
  setNewPasswordSuccessfully,
};
