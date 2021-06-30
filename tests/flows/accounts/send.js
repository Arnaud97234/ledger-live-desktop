/* eslint-disable jest/no-export */
import { app, sendModal, modalPage, mockDeviceEvent } from "../../common.js";

const sendFunds = currency => {
  describe(`send ${currency}`, () => {
    beforeAll(async () => {
      await sendModal.goToSendFlow();
      const modalTitle = await modalPage.title();
      await modalTitle.waitForDisplayed();
    });

    it("write recipient address", async () => {
      const input = await sendModal.modalSendRecipientInput();
      await input.setValue("1oMbFLdCNKhYPrQn1G24ysnyspM2VN");
      const btn = await sendModal.modalSendContinueButton();
      await btn.waitForEnabled();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-send-recipiennt-step`,
      });
    });
  });
};

export default sendFunds;
