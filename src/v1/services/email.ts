/**
 * @file email service
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

const email = {
  /**
   */
  async sendVerifySignup(params: { to: string; token: string }): Promise<void> {
    const { to, token } = params;
  }
};

const emailService = email;

export { email, emailService };
