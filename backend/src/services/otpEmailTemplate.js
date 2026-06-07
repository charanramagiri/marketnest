const otpEmailTemplate = (otp) => {
    return `
      <div style="font-family: Arial, sans-serif;">
        <h2>MarketNest Verification</h2>
  
        <p>Your OTP for account verification is:</p>
  
        <h1>${otp}</h1>
  
        <p>This OTP is valid for 5 minutes.</p>
  
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;
  };
  
  module.exports = otpEmailTemplate;