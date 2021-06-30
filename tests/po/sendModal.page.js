import Modal from "./modal.page";

export default class SendModalPage extends Modal {
  async modalSendRecipientInput() {
    return this.$("#send-recipient-input");
  }

  async modalSendContinueButton() {
    return this.$("#send-recipient-continue-button");
  }
}