/**
 * @file email service
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

export const email = {
  /**
   */
  async sendVerifySignup(params: { to: string; token: string }): Promise<void> {
    // TODO:
    // @ts-ignore
    const { to, token } = params;
    throw new Error("unimplemented");
  }
};

export const emailService = email;
